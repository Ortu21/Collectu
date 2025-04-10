using System.Text.Json;
using CardCollectionAPI.Data;
using CardCollectionAPI.Models;
using CardCollectionAPI.Models.Dtos;
using CardCollectionAPI.Services.Interfaces;
using CardCollectionAPI.Services.Mappers;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Services
{
    public class PokemonPriceService(HttpClient httpClient, AppDbContext dbContext, ILogger<PokemonPriceService> logger, IConfiguration configuration) : IPokemonPriceService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly AppDbContext _dbContext = dbContext;
        private readonly ILogger<PokemonPriceService> _logger = logger;
        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };
        private const string ApiUrl = "https://api.pokemontcg.io/v2/cards";
        private readonly string _apiKey = configuration["PokemonTcg:ApiKey"] ?? throw new InvalidOperationException("API key for Pokemon TCG not found in configuration");

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

                // Per ogni carta, utilizza un nuovo DbContext per evitare problemi di tracking
                foreach (var cardId in cardIds)
                {
                    try
                    {
                        // Utilizzo un nuovo scope di servizi per ottenere un nuovo DbContext per ogni carta
                        using var scope = new HttpClient();
                        
                        // Chiamo il servizio per aggiornare una singola carta
                        await UpdateSingleCardIndependentAsync(cardId);
                        successCount++;
                    }
                    catch (DbUpdateException ex) when (ex.InnerException?.Message?.Contains("23505") == true)
                    {
                        _logger.LogDebug("Carta {CardId} saltata: prezzi già aggiornati per oggi", cardId);
                        skippedCount++;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Errore durante l'aggiornamento dei prezzi per la carta {CardId}", cardId);
                        errorCount++;
                    }
                    
                    // Pulisco il contesto dopo ogni carta per evitare accumulo di entità tracciate
                    _dbContext.ChangeTracker.Clear();
                }

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
                await UpdateSingleCardIndependentAsync(cardId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Errore durante l'aggiornamento dei prezzi per la carta {CardId}", cardId);
                throw;
            }
        }

        /// <summary>
        /// Aggiorna i prezzi di una singola carta in modo indipendente
        /// </summary>
        private async Task UpdateSingleCardIndependentAsync(string cardId)
        {
            // Pulisco eventuali entità tracciate prima di iniziare
            _dbContext.ChangeTracker.Clear();
            
            // Utilizzo lo stesso codice di UpdateSingleCardPriceAsync, ma con contesto pulito
            _logger.LogDebug("Inizio aggiornamento prezzi per carta {CardId}", cardId);

            // Verifica se la carta esiste nel database
            var existingCard = await _dbContext.PokemonCards
                .AsNoTracking() // Importante: Non tracciare per evitare update automatici
                .FirstOrDefaultAsync(c => c.Id == cardId);

            if (existingCard == null)
            {
                _logger.LogWarning("Carta {CardId} non trovata nel database", cardId);
                throw new KeyNotFoundException($"La carta con ID {cardId} non è stata trovata nel database");
            }

            var request = new HttpRequestMessage(HttpMethod.Get, $"{ApiUrl}/{cardId}");
            request.Headers.Add("X-Api-Key", _apiKey);

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Errore API TCG per carta {CardId}: {StatusCode}", cardId, response.StatusCode);
                throw new HttpRequestException($"Errore nella richiesta API: {response.StatusCode}");
            }

            var content = await response.Content.ReadAsStringAsync();
            var cardDto = JsonSerializer.Deserialize<PokemonCardService.SingleCardResponse>(content, _jsonSerializerOptions)?.Data;

            if (cardDto == null)
            {
                _logger.LogWarning("Nessun dato ricevuto dall'API per la carta {CardId}", cardId);
                throw new InvalidOperationException($"Nessun dato ricevuto dall'API per la carta {cardId}");
            }

            // Controlla se ci sono già prezzi per oggi prima di procedere
            var today = DateOnly.FromDateTime(DateTime.Today);
            
            // Verifico se esistono già dati per oggi per CardMarket
            var existingCardMarketToday = await _dbContext.PokemonCardMarketPrices
                .AnyAsync(p => p.PokemonCardId == cardId && p.UpdatedAt == today);
            
            // Verifico se esistono già dati per oggi per TcgPlayer
            var existingTcgToday = await _dbContext.PokemonCardTcgPrices
                .AnyAsync(p => p.PokemonCardId == cardId && p.UpdatedAt == today);
            
            bool dataAdded = false;
            
            // Inserisco prezzi CardMarket solo se non esistono già per oggi
            if (!existingCardMarketToday && cardDto.Cardmarket != null)
            {
                var cardMarketDate = GetUpdatedAtFromDto(cardDto.Cardmarket.UpdatedAt);
                
                // Inserisco solo se i dati sono di oggi
                if (cardMarketDate == today)
                {
                    await AddCardMarketPricesAsync(cardDto, cardId);
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
                    await AddTcgPlayerPricesAsync(cardDto, cardId);
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

        private async Task AddCardMarketPricesAsync(PokemonCardDto cardDto, string cardId)
        {
            if (cardDto.Cardmarket?.CardmarketPrices == null) return;
            
            var updatedAt = GetUpdatedAtFromDto(cardDto.Cardmarket.UpdatedAt);
            _logger.LogDebug("CardMarket - Inserimento prezzi per carta {CardId} del {UpdatedAt}", cardId, updatedAt);
            
            // Creo nuova testata
            var newHeader = new PokemonCardMarketPrices
            {
                PokemonCardId = cardId,
                UpdatedAt = updatedAt,
                Url = cardDto.Cardmarket.Url?.ToString() ?? string.Empty,
                PriceDetails = [],
                PokemonCard = null!  // Richiesto dal compilatore, sarà gestito automaticamente da EF Core
            };

            // Creo nuovi dettagli
            var newDetails = new PokemonCardMarketPriceDetails
            {
                PokemonCardId = cardId,
                UpdatedAt = updatedAt,
                PokemonCardMarketPrices = newHeader,
                AverageSellPrice = cardDto.Cardmarket.CardmarketPrices.AverageSellPrice,
                LowPrice = cardDto.Cardmarket.CardmarketPrices.LowPrice,
                TrendPrice = cardDto.Cardmarket.CardmarketPrices.TrendPrice,
                GermanProLow = cardDto.Cardmarket.CardmarketPrices.GermanProLow,
                SuggestedPrice = cardDto.Cardmarket.CardmarketPrices.SuggestedPrice,
                ReverseHoloSell = cardDto.Cardmarket.CardmarketPrices.ReverseHoloSell,
                ReverseHoloLow = cardDto.Cardmarket.CardmarketPrices.ReverseHoloLow,
                ReverseHoloTrend = cardDto.Cardmarket.CardmarketPrices.ReverseHoloTrend,
                LowPriceExPlus = cardDto.Cardmarket.CardmarketPrices.LowPriceExPlus,
                Avg1 = cardDto.Cardmarket.CardmarketPrices.Avg1,
                Avg7 = cardDto.Cardmarket.CardmarketPrices.Avg7,
                Avg30 = cardDto.Cardmarket.CardmarketPrices.Avg30,
                ReverseHoloAvg1 = cardDto.Cardmarket.CardmarketPrices.ReverseHoloAvg1,
                ReverseHoloAvg7 = cardDto.Cardmarket.CardmarketPrices.ReverseHoloAvg7,
                ReverseHoloAvg30 = cardDto.Cardmarket.CardmarketPrices.ReverseHoloAvg30
            };
            
            // Aggiunta alla testata la lista dei dettagli
            newHeader.PriceDetails.Add(newDetails);
            
            // Aggiungo al database prima la testata e poi i dettagli (in un'unica operazione)
            _dbContext.PokemonCardMarketPrices.Add(newHeader);
            
            // Salvo immediatamente (ogni mercato ha il suo salvataggio)
            try
            {
                await _dbContext.SaveChangesAsync();
                _logger.LogDebug("CardMarket - Salvati prezzi per carta {CardId}", cardId);
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message?.Contains("23505") == true)
            {
                // Ignora errori di chiave duplicata
                _logger.LogDebug("CardMarket - Prezzi già esistenti per carta {CardId}", cardId);
            }
        }

        private async Task AddTcgPlayerPricesAsync(PokemonCardDto cardDto, string cardId)
        {
            if (cardDto.Tcgplayer?.TcgplayerPrices == null) return;
            
            var updatedAt = GetUpdatedAtFromDto(cardDto.Tcgplayer.UpdatedAt);
            _logger.LogDebug("TCGPlayer - Inserimento prezzi per carta {CardId} del {UpdatedAt}", cardId, updatedAt);
            
            // Creo nuova testata
            var newHeader = new PokemonTcgPlayerPrices
            {
                PokemonCardId = cardId,
                UpdatedAt = updatedAt,
                Url = cardDto.Tcgplayer.Url?.ToString() ?? string.Empty,
                PriceDetails = [],
                PokemonCard = null!  // Richiesto dal compilatore, sarà gestito automaticamente da EF Core
            };

            // Aggiungo i dettagli per ogni tipo di foil
            if (cardDto.Tcgplayer.TcgplayerPrices.Holofoil != null)
            {
                AddTcgPriceDetail(newHeader, "Holofoil", cardDto.Tcgplayer.TcgplayerPrices.Holofoil, updatedAt);
            }
            if (cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil != null)
            {
                AddTcgPriceDetail(newHeader, "ReverseHolofoil", cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil, updatedAt);
            }
            if (cardDto.Tcgplayer.TcgplayerPrices.Normal != null)
            {
                AddTcgPriceDetail(newHeader, "Normal", cardDto.Tcgplayer.TcgplayerPrices.Normal, updatedAt);
            }
            if (cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil != null)
            {
                AddTcgPriceDetail(newHeader, "1stEditionHolofoil", cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil, updatedAt);
            }
            
            // Aggiungo al database
            _dbContext.PokemonCardTcgPrices.Add(newHeader);
            
            // Salvo immediatamente (ogni mercato ha il suo salvataggio)
            try
            {
                await _dbContext.SaveChangesAsync();
                _logger.LogDebug("TCGPlayer - Salvati prezzi per carta {CardId}", cardId);
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message?.Contains("23505") == true)
            {
                // Ignora errori di chiave duplicata
                _logger.LogDebug("TCGPlayer - Prezzi già esistenti per carta {CardId}", cardId);
            }
        }

        private static void AddTcgPriceDetail(PokemonTcgPlayerPrices header, string foilType, dynamic prices, DateOnly updatedAt)
        {
            var newDetail = new PokemonTcgPlayerPriceDetails
            {
                PokemonCardId = header.PokemonCardId,
                UpdatedAt = updatedAt,
                PokemonTcgPlayerPrices = header,
                FoilType = foilType,
                Low = prices?.Low ?? 0,
                Mid = prices?.Mid ?? 0,
                High = prices?.High ?? 0,
                Market = prices?.Market ?? 0,
                DirectLow = prices?.DirectLow ?? 0
            };

            header.PriceDetails.Add(newDetail);
        }

        private static DateOnly GetUpdatedAtFromDto(string? updatedAtString)
        {
            return DateOnly.TryParse(updatedAtString, out var parsedDate) 
                ? parsedDate 
                : DateOnly.FromDateTime(DateTime.Today);
        }
    }
}