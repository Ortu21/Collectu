using System.Text.Json;
using CardCollectionAPI.Data;
using CardCollectionAPI.Models;
using CardCollectionAPI.Models.Dtos;
using CardCollectionAPI.Services.Interfaces;
using CardCollectionAPI.Services.Mappers;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Services
{
    public class PokemonPriceService(HttpClient httpClient, AppDbContext dbContext, ILogger<PokemonPriceService> logger, IConfiguration configuration, IServiceScopeFactory serviceScopeFactory) : IPokemonPriceService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly AppDbContext _dbContext = dbContext;
        private readonly ILogger<PokemonPriceService> _logger = logger;
        private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };
        private const string ApiUrl = "https://api.pokemontcg.io/v2/cards";
        private readonly string _apiKey = configuration["PokemonTcg:ApiKey"] ?? throw new InvalidOperationException("API key for Pokemon TCG not found in configuration");
        private readonly int _maxDegreeOfParallelism = int.Parse(configuration["PokemonTcg:MaxParallelRequests"] ?? "5");

        /// <summary>
        /// Aggiorna i prezzi di tutte le carte Pokémon esistenti nel database
        /// </summary>
        public async Task UpdateCardPricesAsync()
        {
            try
            {
                _logger.LogInformation("Inizio aggiornamento prezzi di tutte le carte Pokémon");
                
                // Recupera solo gli ID delle carte dal database per evitare problemi di tracking tra carte diverse
                var cardIds = await _dbContext.PokemonCards
                    .Select(c => c.Id)
                    .ToListAsync();

                _logger.LogInformation("Trovate {CardCount} carte da aggiornare", cardIds.Count);

                int successCount = 0;
                int errorCount = 0;
                int skippedCount = 0;
                
                // Usa un semaforo per tenere traccia delle statistiche in modo thread-safe
                var lockObject = new object();
                
                // Configura le opzioni per il parallelismo
                var options = new ParallelOptions 
                { 
                    MaxDegreeOfParallelism = _maxDegreeOfParallelism 
                };

                // Esegue l'aggiornamento in parallelo con un numero limitato di thread
                await Parallel.ForEachAsync(cardIds, options, async (cardId, cancellationToken) =>
                {
                    try
                    {
                        // Crea un nuovo scope per ogni thread per ottenere un nuovo DbContext
                        using var scope = _serviceScopeFactory.CreateScope();
                        var scopedDbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        
                        // Creo un nuovo HttpClient locale per ogni thread per evitare condivisione di stato
                        using var localHttpClient = new HttpClient();
                        
                        // Chiamo il servizio per aggiornare una singola carta
                        await UpdateSingleCardWithScopedContextAsync(cardId, scopedDbContext, localHttpClient, cancellationToken);
                        
                        // Aggiorna le statistiche in modo thread-safe
                        lock (lockObject)
                        {
                            successCount++;
                        }
                    }
                    catch (DbUpdateException ex) when (ex.InnerException?.Message?.Contains("23505") == true)
                    {
                        lock (lockObject)
                        {
                            _logger.LogDebug("Carta {CardId} saltata: prezzi già aggiornati per oggi", cardId);
                            skippedCount++;
                        }
                    }
                    catch (Exception ex)
                    {
                        lock (lockObject)
                        {
                            _logger.LogError(ex, "Errore durante l'aggiornamento dei prezzi per la carta {CardId}", cardId);
                            errorCount++;
                        }
                    }
                });

                _logger.LogInformation("Aggiornamento prezzi completato. Successi: {SuccessCount}, Saltati: {SkippedCount}, Errori: {ErrorCount}", 
                    successCount, skippedCount, errorCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Errore durante l'aggiornamento dei prezzi delle carte");
                throw;
            }
        }

        /// <summary>
        /// Aggiorna i prezzi di una singola carta Pokémon
        /// </summary>
        /// <param name="cardId">ID della carta da aggiornare</param>
        public async Task UpdateSingleCardPriceAsync(string cardId)
        {
            try
            {
                // Pulisco il contesto e utilizzo il metodo privato
                _dbContext.ChangeTracker.Clear();
                await UpdateSingleCardWithScopedContextAsync(cardId, _dbContext, _httpClient, CancellationToken.None);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Errore durante l'aggiornamento dei prezzi per la carta {CardId}", cardId);
                throw;
            }
        }

        /// <summary>
        /// Aggiorna i prezzi di una singola carta in modo indipendente usando il contesto fornito
        /// </summary>
        private async Task UpdateSingleCardWithScopedContextAsync(string cardId, AppDbContext dbContext, HttpClient httpClient, CancellationToken cancellationToken)
        {
            // Utilizzo lo stesso codice di UpdateSingleCardPriceAsync, ma con contesto scoped
            _logger.LogDebug("Inizio aggiornamento prezzi per carta {CardId}", cardId);

            // Verifica se la carta esiste nel database
            var existingCard = await dbContext.PokemonCards
                .AsNoTracking() // Importante: Non tracciare per evitare update automatici
                .FirstOrDefaultAsync(c => c.Id == cardId, cancellationToken);

            if (existingCard == null)
            {
                _logger.LogWarning("Carta {CardId} non trovata nel database", cardId);
                throw new KeyNotFoundException($"La carta con ID {cardId} non è stata trovata nel database");
            }

            var request = new HttpRequestMessage(HttpMethod.Get, $"{ApiUrl}/{cardId}");
            request.Headers.Add("X-Api-Key", _apiKey);

            var response = await httpClient.SendAsync(request, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Errore API TCG per carta {CardId}: {StatusCode}", cardId, response.StatusCode);
                throw new HttpRequestException($"Errore nella richiesta API: {response.StatusCode}");
            }

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            var cardDto = JsonSerializer.Deserialize<PokemonCardService.SingleCardResponse>(content, _jsonSerializerOptions)?.Data;

            if (cardDto == null)
            {
                _logger.LogWarning("Nessun dato ricevuto dall'API per la carta {CardId}", cardId);
                throw new InvalidOperationException($"Nessun dato ricevuto dall'API per la carta {cardId}");
            }

            // Controlla se ci sono già prezzi per oggi prima di procedere
            var today = DateOnly.FromDateTime(DateTime.Today);
            
            // Verifico se esistono già dati per oggi per CardMarket
            var existingCardMarketToday = await dbContext.PokemonCardMarketPrices
                .AnyAsync(p => p.PokemonCardId == cardId && p.UpdatedAt == today, cancellationToken);
            
            // Verifico se esistono già dati per oggi per TcgPlayer
            var existingTcgToday = await dbContext.PokemonCardTcgPrices
                .AnyAsync(p => p.PokemonCardId == cardId && p.UpdatedAt == today, cancellationToken);
            
            bool dataAdded = false;
            
            // Inserisco prezzi CardMarket solo se non esistono già per oggi
            if (!existingCardMarketToday && cardDto.Cardmarket != null)
            {
                var cardMarketDate = GetUpdatedAtFromDto(cardDto.Cardmarket.UpdatedAt);
                
                // Inserisco solo se i dati sono di oggi
                if (cardMarketDate == today)
                {
                    await AddCardMarketPricesAsync(cardDto, cardId, dbContext, cancellationToken);
                    dataAdded = true;
                }
            }
            
            // Inserisco prezzi TcgPlayer solo se non esistono già per oggi
            if (!existingTcgToday && cardDto.Tcgplayer != null)
            {
                var tcgDate = GetUpdatedAtFromDto(cardDto.Tcgplayer.UpdatedAt);
                
                // Inserisco solo se i dati sono di oggi
                if (tcgDate == today)
                {
                    await AddTcgPlayerPricesAsync(cardDto, cardId, dbContext, cancellationToken);
                    dataAdded = true;
                }
            }

            if (dataAdded)
            {
                _logger.LogInformation("Prezzi aggiornati con successo per la carta {CardId}", cardId);
            }
            else
            {
                _logger.LogInformation("Nessun nuovo prezzo da aggiungere per la carta {CardId}", cardId);
            }
        }

        private async Task AddCardMarketPricesAsync(PokemonCardDto cardDto, string cardId, AppDbContext dbContext, CancellationToken cancellationToken)
        {
            if (cardDto.Cardmarket?.CardmarketPrices == null) return;
            
            var updatedAt = GetUpdatedAtFromDto(cardDto.Cardmarket.UpdatedAt);
            _logger.LogDebug("CardMarket - Inserimento prezzi per carta {CardId} del {UpdatedAt}", cardId, updatedAt);
            
            // Utilizzo il mapper per creare l'entità dei prezzi
            var newHeader = PokemonPriceMapper.CreateCardMarketPrices(cardDto, cardId, updatedAt);
            
            // Aggiungo al database
            dbContext.PokemonCardMarketPrices.Add(newHeader);
            
            // Salvo immediatamente (ogni mercato ha il suo salvataggio)
            try
            {
                await dbContext.SaveChangesAsync(cancellationToken);
                _logger.LogDebug("CardMarket - Salvati prezzi per carta {CardId}", cardId);
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message?.Contains("23505") == true)
            {
                // Ignora errori di chiave duplicata
                _logger.LogDebug("CardMarket - Prezzi già esistenti per carta {CardId}", cardId);
            }
        }

        private async Task AddTcgPlayerPricesAsync(PokemonCardDto cardDto, string cardId, AppDbContext dbContext, CancellationToken cancellationToken)
        {
            if (cardDto.Tcgplayer?.TcgplayerPrices == null) return;
            
            var updatedAt = GetUpdatedAtFromDto(cardDto.Tcgplayer.UpdatedAt);
            _logger.LogDebug("TCGPlayer - Inserimento prezzi per carta {CardId} del {UpdatedAt}", cardId, updatedAt);
            
            // Utilizzo il mapper per creare l'entità dei prezzi
            var newHeader = PokemonPriceMapper.CreateTcgPlayerPrices(cardDto, cardId, updatedAt);
            
            // Aggiungo al database
            dbContext.PokemonCardTcgPrices.Add(newHeader);
            
            // Salvo immediatamente (ogni mercato ha il suo salvataggio)
            try
            {
                await dbContext.SaveChangesAsync(cancellationToken);
                _logger.LogDebug("TCGPlayer - Salvati prezzi per carta {CardId}", cardId);
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message?.Contains("23505") == true)
            {
                // Ignora errori di chiave duplicata
                _logger.LogDebug("TCGPlayer - Prezzi già esistenti per carta {CardId}", cardId);
            }
        }

        private static DateOnly GetUpdatedAtFromDto(string? updatedAtString)
        {
            return PokemonPriceMapper.ParseDateFromString(updatedAtString);
        }
    }
}