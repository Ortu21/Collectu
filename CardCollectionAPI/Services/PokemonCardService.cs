using System.Text.Json;
using CardCollectionAPI.Data;
using CardCollectionAPI.Models.Dtos;
using CardCollectionAPI.Services.Interfaces;
using CardCollectionAPI.Services.Mappers;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Services
{
    /// <summary>
    /// Servizio per l'importazione e la gestione delle carte Pokémon
    /// </summary>
    public class PokemonCardService(HttpClient httpClient, AppDbContext dbContext, ILogger<PokemonCardService> logger, IConfiguration configuration, IServiceScopeFactory serviceScopeFactory) : IPokemonCardService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly AppDbContext _dbContext = dbContext;
        private readonly ILogger<PokemonCardService> _logger = logger;
        private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
        private readonly PokemonSetService _pokemonSetService = new(dbContext);
        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };
        private const string ApiUrl = "https://api.pokemontcg.io/v2/cards";
        private readonly string _apiKey = configuration["PokemonTcg:ApiKey"] ?? throw new InvalidOperationException("API key for Pokemon TCG not found in configuration");
        private readonly int _maxDegreeOfParallelism = int.Parse(configuration["PokemonTcg:MaxParallelRequests"] ?? "5");
        private readonly int _maxConcurrentPages = int.Parse(configuration["PokemonTcg:MaxConcurrentPages"] ?? "3");
        private const int _pageSize = 250;

        /// <summary>
        /// Importa tutte le carte Pokémon dall'API esterna al database
        /// </summary>
        public async Task ImportPokemonCardsAsync()
        {
            try
            {
                int totalPages = await GetTotalPagesAsync();
                _logger.LogInformation("Starting Pokemon card import with page size {PageSize}. Total pages: {TotalPages}", _pageSize, totalPages);

                // Processa le pagine in batch
                for (int pageStart = 1; pageStart <= totalPages; pageStart += _maxConcurrentPages)
                {
                    var pagesToFetch = new List<int>();
                    // Calcola quali pagine recuperare in questo batch
                    for (int i = 0; i < _maxConcurrentPages && pageStart + i <= totalPages; i++)
                    {
                        pagesToFetch.Add(pageStart + i);
                    }

                    _logger.LogInformation("Fetching batch of pages: {Pages}", string.Join(", ", pagesToFetch));
                    
                    // Esegui in parallelo il recupero delle pagine
                    var pageTasksList = pagesToFetch.Select(page => FetchAndProcessPageAsync(page)).ToList();
                    
                    // Attendi che tutte le pagine del batch siano state elaborate
                    await Task.WhenAll(pageTasksList);
                    
                    _logger.LogInformation("Completed batch of pages: {Pages}", string.Join(", ", pagesToFetch));
                }

                _logger.LogInformation("Pokemon card import completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during Pokémon card import");
            }
        }

        /// <summary>
        /// Calcola il numero totale di pagine basato sui metadati dell'API
        /// </summary>
        /// <returns>Numero totale di pagine da elaborare</returns>
        private async Task<int> GetTotalPagesAsync()
        {
            try
            {
                // Richiesta per la prima pagina con pageSize=1 per ottenere i metadati con il minimo di dati
                var request = new HttpRequestMessage(HttpMethod.Get, $"{ApiUrl}?page=1&pageSize=1");
                request.Headers.Add("X-Api-Key", _apiKey);
                
                _logger.LogInformation("Richiedendo metadati API: {URL}", request.RequestUri);
                
                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                
                // Deserializza la risposta dell'API
                var apiMetadata = JsonSerializer.Deserialize<ApiRootResponse>(content, _jsonSerializerOptions);
                
                if (apiMetadata?.page > 0 && apiMetadata.pageSize > 0 && apiMetadata.totalCount > 0)
                {
                    // Calcola il numero totale di pagine basato sul numero totale di carte
                    int totalPages = (int)Math.Ceiling((double)apiMetadata.totalCount / _pageSize);
                    _logger.LogInformation("Metadati: Page={Page}, PageSize={PageSize}, Count={Count}, TotalCount={TotalCount}", 
                        apiMetadata.page, apiMetadata.pageSize, apiMetadata.count, apiMetadata.totalCount);
                    _logger.LogInformation("Calcolo pagine totali: {TotalCount} / {PageSize} = {TotalPages}", 
                        apiMetadata.totalCount, _pageSize, totalPages);
                    
                    return Math.Max(1, totalPages); // Assicura almeno 1 pagina
                }
                
                _logger.LogWarning("Metadati API non validi, assumo che ci sia almeno una pagina");
                return 1; // Fallback a una pagina
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Errore durante il recupero del conteggio totale delle pagine");
                return 1; // In caso di errore, assumiamo almeno una pagina
            }
        }

        /// <summary>
        /// Recupera e processa una singola pagina di carte dall'API
        /// </summary>
        /// <param name="page">Numero di pagina da elaborare</param>
        private async Task FetchAndProcessPageAsync(int page)
        {
            try
            {
                _logger.LogInformation("Elaborazione pagina {CurrentPage}", page);
                
                var request = new HttpRequestMessage(HttpMethod.Get, $"{ApiUrl}?page={page}&pageSize={_pageSize}");
                request.Headers.Add("X-Api-Key", _apiKey);

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("TCG API request fallita con status code: {StatusCode} per pagina {Page}", response.StatusCode, page);
                    return;
                }

                var content = await response.Content.ReadAsStringAsync();
                var apiPageResponse = JsonSerializer.Deserialize<ApiRootResponse>(content, _jsonSerializerOptions);

                if (apiPageResponse?.data == null || apiPageResponse.data.Count == 0)
                {
                    _logger.LogInformation("Nessuna carta trovata nella pagina {CurrentPage}", page);
                    return;
                }

                _logger.LogInformation("Trovate {CardCount} carte nella pagina {CurrentPage}", apiPageResponse.data.Count, page);

                // Oggetto per il lock delle statistiche
                var lockObject = new object();
                int processedCount = 0;
                int errorCount = 0;

                // Configura le opzioni per il parallelismo
                var options = new ParallelOptions
                {
                    MaxDegreeOfParallelism = _maxDegreeOfParallelism
                };

                // Elabora le carte in parallelo
                await Parallel.ForEachAsync(apiPageResponse.data, options, async (card, cancellationToken) =>
                {
                    try
                    {
                        // Crea un nuovo scope per ogni thread per ottenere un nuovo DbContext
                        using var scope = _serviceScopeFactory.CreateScope();
                        var scopedDbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        
                        // Crea un nuovo servizio PokemonSetService con il contesto scoped
                        var scopedSetService = new PokemonSetService(scopedDbContext);
                        
                        // Elabora la carta con il contesto scoped
                        await ProcessCardWithScopedContextAsync(card, scopedDbContext, scopedSetService, cancellationToken);
                        
                        lock (lockObject)
                        {
                            processedCount++;
                            if (processedCount % 10 == 0)
                            {
                                _logger.LogInformation("Elaborate {Count}/{Total} carte dalla pagina {Page}", 
                                    processedCount, apiPageResponse.data.Count, page);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        lock (lockObject)
                        {
                            _logger.LogError(ex, "Errore durante l'elaborazione della carta {CardId}", card.Id);
                            errorCount++;
                        }
                    }
                });

                _logger.LogInformation("Completata l'elaborazione della pagina {CurrentPage}. Elaborate: {ProcessedCount}, Errori: {ErrorCount}", 
                    page, processedCount, errorCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Errore durante l'elaborazione della pagina {Page}", page);
            }
        }

        /// <summary>
        /// Elabora una singola carta: la crea se non esiste, o la aggiorna se esiste già
        /// </summary>
        /// <param name="cardDto">Dati della carta da elaborare</param>
        /// <param name="dbContext">Contesto del database</param>
        /// <param name="setService">Servizio per gestire i set di carte</param>
        /// <param name="cancellationToken">Token di cancellazione</param>
        private async Task ProcessCardWithScopedContextAsync(PokemonCardDto cardDto, AppDbContext dbContext, PokemonSetService setService, CancellationToken cancellationToken)
        {
            // Recupera o crea il set della carta con il servizio scoped
            var set = await setService.GetOrCreateSetAsync(cardDto.Set);

            // Controlla se la carta esiste già
            var existingCard = await dbContext.PokemonCards
                .FirstOrDefaultAsync(c => c.Id == cardDto.Id, cancellationToken);

            if (existingCard == null)
            {
                // Crea una nuova carta
                var card = PokemonCardMapper.MapDtoToEntity(cardDto);
                card.SetId = set.SetId; // Assegna l'ID del set corretto

                // Aggiungi la carta al contesto
                dbContext.PokemonCards.Add(card);
                await dbContext.SaveChangesAsync(cancellationToken);
            }
            else
            {
                // Aggiorna sempre la carta esistente
                existingCard.Name = cardDto.Name;
                existingCard.Supertype = cardDto.Supertype ?? string.Empty;
                existingCard.Hp = cardDto.Hp;
                existingCard.EvolvesFrom = cardDto.EvolvesFrom ?? string.Empty;
                existingCard.Rarity = cardDto.Rarity ?? string.Empty;
                existingCard.LargeImageUrl = cardDto.Images.Large.ToString();
                existingCard.SmallImageUrl = cardDto.Images.Small.ToString();
                existingCard.SetId = set.SetId;
                existingCard.Number = cardDto.Number ?? string.Empty;
                
                // Aggiorna gli attacchi, le debolezze e le resistenze se necessario
                // Nota: in una implementazione completa, dovresti gestire gli attacchi, le debolezze e le resistenze
                
                await dbContext.SaveChangesAsync(cancellationToken);
                _logger.LogDebug("Aggiornata carta {Name} (ID: {Id})", cardDto.Name, cardDto.Id);
            }
        }

        /// <summary>
        /// Processa una singola carta utilizzando il contesto principale del database
        /// </summary>
        /// <param name="cardDto">Dati della carta da elaborare</param>
        public async Task ProcessCardAsync(PokemonCardDto cardDto)
        {
            await ProcessCardWithScopedContextAsync(cardDto, _dbContext, _pokemonSetService, CancellationToken.None);
        }

        /// <summary>
        /// Importa una singola carta Pokémon identificata dal suo ID
        /// </summary>
        /// <param name="cardId">ID della carta da importare</param>
        public async Task ImportSingleCardAsync(string cardId)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, $"{ApiUrl}/{cardId}");
                request.Headers.Add("X-Api-Key", _apiKey);

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("TCG API request failed with status code: {StatusCode}", response.StatusCode);
                    return;
                }

                var content = await response.Content.ReadAsStringAsync();
                var cardDto = JsonSerializer.Deserialize<SingleCardResponse>(content, _jsonSerializerOptions)?.Data;

                if (cardDto == null)
                {
                    _logger.LogWarning("No data received from TCG API for card {CardId}", cardId);
                    return;
                }

                await ProcessCardAsync(cardDto);
                _logger.LogInformation("Successfully imported card {CardId}", cardId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during import of card {CardId}", cardId);
                throw;
            }
        }

        /// <summary>
        /// Classe per deserializzare la risposta con una singola carta
        /// </summary>
        public class SingleCardResponse
        {
            public PokemonCardDto Data { get; set; } = null!;
        }
        
        /// <summary>
        /// Classe che corrisponde esattamente al formato JSON mostrato dell'API Pokémon TCG
        /// </summary>
        public class ApiRootResponse
        {
            public List<PokemonCardDto> data { get; set; } = [];
            public int page { get; set; }
            public int pageSize { get; set; }
            public int count { get; set; }
            public int totalCount { get; set; }
        }
    }
}