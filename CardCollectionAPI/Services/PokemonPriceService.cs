using System.Text.Json;
using CardCollectionAPI.Data;
using CardCollectionAPI.Models;
using CardCollectionAPI.Models.Dtos;
using CardCollectionAPI.Services.Interfaces;
using CardCollectionAPI.Services.Mappers;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Services
{
    public class PokemonPriceService : IPokemonPriceService
    {
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _dbContext;
        private readonly ILogger<PokemonPriceService> _logger;
        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };
        private const string ApiUrl = "https://api.pokemontcg.io/v2/cards";
        private readonly string _apiKey;

        public PokemonPriceService(HttpClient httpClient, AppDbContext dbContext, ILogger<PokemonPriceService> logger, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _dbContext = dbContext;
            _logger = logger;
            _apiKey = configuration["PokemonTcg:ApiKey"] ?? throw new InvalidOperationException("API key for Pokemon TCG not found in configuration");
        }

        /// <summary>
        /// Aggiorna i prezzi di tutte le carte Pokémon esistenti nel database
        /// </summary>
        public async Task UpdateCardPricesAsync()
        {
            try
            {
                _logger.LogInformation("Inizio aggiornamento prezzi di tutte le carte Pokémon");
                
                // Recupera tutte le carte dal database
                var cards = await _dbContext.PokemonCards
                    .Include(c => c.CardMarketPrices)
                    .Include(c => c.TcgPlayerPrices)
                    .ToListAsync();

                _logger.LogInformation("Trovate {CardCount} carte da aggiornare", cards.Count);

                int successCount = 0;
                int errorCount = 0;

                foreach (var card in cards)
                {
                    try
                    {
                        await UpdateSingleCardPriceAsync(card.Id);
                        successCount++;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Errore durante l'aggiornamento dei prezzi per la carta {CardId}", card.Id);
                        errorCount++;
                    }
                }

                _logger.LogInformation("Aggiornamento prezzi completato. Successi: {SuccessCount}, Errori: {ErrorCount}", successCount, errorCount);
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
                _logger.LogInformation("Aggiornamento prezzi per la carta {CardId}", cardId);

                // Verifica se la carta esiste nel database
                var existingCard = await _dbContext.PokemonCards
                    .Include(c => c.CardMarketPrices)
                    .Include(c => c.TcgPlayerPrices)
                    .FirstOrDefaultAsync(c => c.Id == cardId);

                if (existingCard == null)
                {
                    _logger.LogWarning("La carta {CardId} non esiste nel database", cardId);
                    throw new KeyNotFoundException($"La carta con ID {cardId} non è stata trovata nel database");
                }

                // Recupera i dati aggiornati dalla API
                var request = new HttpRequestMessage(HttpMethod.Get, $"{ApiUrl}/{cardId}");
                request.Headers.Add("X-Api-Key", _apiKey);

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("TCG API request failed with status code: {StatusCode}", response.StatusCode);
                    throw new HttpRequestException($"Errore nella richiesta API: {response.StatusCode}");
                }

                var content = await response.Content.ReadAsStringAsync();
                var cardDto = JsonSerializer.Deserialize<PokemonCardService.SingleCardResponse>(content, _jsonSerializerOptions)?.Data;

                if (cardDto == null)
                {
                    _logger.LogWarning("No data received from TCG API for card {CardId}", cardId);
                    throw new InvalidOperationException($"Nessun dato ricevuto dall'API per la carta {cardId}");
                }

                // Aggiorna i prezzi
                UpdateCardMarketPrices(cardDto, existingCard);
                UpdateTcgPlayerPrices(cardDto, existingCard);

                await _dbContext.SaveChangesAsync();
                _logger.LogInformation("Prezzi aggiornati con successo per la carta {CardId}", cardId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Errore durante l'aggiornamento dei prezzi per la carta {CardId}", cardId);
                throw;
            }
        }

        private static void UpdateCardMarketPrices(PokemonCardDto cardDto, PokemonCard card)
        {
            if (cardDto.Cardmarket == null) return;

            // Ottieni la data di aggiornamento dal DTO
            var updatedAt = DateOnly.TryParse(cardDto.Cardmarket.UpdatedAt, out var parsedDate) ? parsedDate : DateOnly.FromDateTime(DateTime.Today);

            // Verifica se esiste già un record per i prezzi di CardMarket per questa data
            var existingPrices = card.CardMarketPrices;
            
            if (existingPrices == null || existingPrices.UpdatedAt != updatedAt)
            {
                // Se non esiste un record per questa data, creane uno nuovo
                card.CardMarketPrices = new PokemonCardMarketPrices
                {
                    PokemonCardId = card.Id,
                    PokemonCard = card,
                    Url = cardDto.Cardmarket.Url?.ToString() ?? string.Empty,
                    UpdatedAt = updatedAt,
                    PriceDetails = []
                };
            }
            else
            {
                // Aggiorna solo l'URL se il record per questa data esiste già
                // Verifica che card.CardMarketPrices non sia null prima di accedere alle sue proprietà
                if (card.CardMarketPrices != null)
                {
                    card.CardMarketPrices.Url = cardDto.Cardmarket.Url?.ToString() ?? card.CardMarketPrices.Url ?? string.Empty;
                }
            }

            // Verifica se esiste già un record di dettagli prezzi per questa data
            PokemonCardMarketPriceDetails? existingPriceDetails = null;
            if (card.CardMarketPrices?.PriceDetails != null)
            {
                existingPriceDetails = card.CardMarketPrices.PriceDetails
                    .FirstOrDefault(pd => pd.PokemonCardId == card.Id && pd.UpdatedAt == updatedAt);
            }

            if (existingPriceDetails != null)
            {
                // Aggiorna i dettagli dei prezzi esistenti
                existingPriceDetails.AverageSellPrice = cardDto.Cardmarket?.CardmarketPrices?.AverageSellPrice;
                existingPriceDetails.LowPrice = cardDto.Cardmarket?.CardmarketPrices?.LowPrice;
                existingPriceDetails.TrendPrice = cardDto.Cardmarket?.CardmarketPrices?.TrendPrice;
                existingPriceDetails.GermanProLow = cardDto.Cardmarket?.CardmarketPrices?.GermanProLow;
                existingPriceDetails.SuggestedPrice = cardDto.Cardmarket?.CardmarketPrices?.SuggestedPrice;
                existingPriceDetails.ReverseHoloSell = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloSell;
                existingPriceDetails.ReverseHoloLow = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloLow;
                existingPriceDetails.ReverseHoloTrend = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloTrend;
                existingPriceDetails.LowPriceExPlus = cardDto.Cardmarket?.CardmarketPrices?.LowPriceExPlus;
                existingPriceDetails.Avg1 = cardDto.Cardmarket?.CardmarketPrices?.Avg1;
                existingPriceDetails.Avg7 = cardDto.Cardmarket?.CardmarketPrices?.Avg7;
                existingPriceDetails.Avg30 = cardDto.Cardmarket?.CardmarketPrices?.Avg30;
                existingPriceDetails.ReverseHoloAvg1 = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloAvg1;
                existingPriceDetails.ReverseHoloAvg7 = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloAvg7;
                existingPriceDetails.ReverseHoloAvg30 = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloAvg30;
            }
            else
            {
                // Crea un nuovo record di dettagli prezzi
                var priceDetails = new PokemonCardMarketPriceDetails
                {
                    PokemonCardId = card.Id,
                    UpdatedAt = updatedAt,
                    // Verifica che card.CardMarketPrices non sia null
                    PokemonCardMarketPrices = card.CardMarketPrices ?? new PokemonCardMarketPrices
                    {
                        PokemonCardId = card.Id,
                        PokemonCard = card,
                        UpdatedAt = updatedAt,
                        Url = cardDto.Cardmarket.Url?.ToString() ?? string.Empty
                    },
                    AverageSellPrice = cardDto.Cardmarket?.CardmarketPrices?.AverageSellPrice,
                    LowPrice = cardDto.Cardmarket?.CardmarketPrices?.LowPrice,
                    TrendPrice = cardDto.Cardmarket?.CardmarketPrices?.TrendPrice,
                    GermanProLow = cardDto.Cardmarket?.CardmarketPrices?.GermanProLow,
                    SuggestedPrice = cardDto.Cardmarket?.CardmarketPrices?.SuggestedPrice,
                    ReverseHoloSell = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloSell,
                    ReverseHoloLow = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloLow,
                    ReverseHoloTrend = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloTrend,
                    LowPriceExPlus = cardDto.Cardmarket?.CardmarketPrices?.LowPriceExPlus,
                    Avg1 = cardDto.Cardmarket?.CardmarketPrices?.Avg1,
                    Avg7 = cardDto.Cardmarket?.CardmarketPrices?.Avg7,
                    Avg30 = cardDto.Cardmarket?.CardmarketPrices?.Avg30,
                    ReverseHoloAvg1 = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloAvg1,
                    ReverseHoloAvg7 = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloAvg7,
                    ReverseHoloAvg30 = cardDto.Cardmarket?.CardmarketPrices?.ReverseHoloAvg30
                };

                // Aggiungi il nuovo record alla collezione
                if (card.CardMarketPrices != null)
                {
                    // Verifica che PriceDetails non sia null prima di operare su di esso
                    if (card.CardMarketPrices.PriceDetails != null)
                    {
                        card.CardMarketPrices.PriceDetails.Add(priceDetails);
                    }
                    else
                    {
                        // Se PriceDetails è null, inizializzalo con una nuova lista contenente i dettagli
                        card.CardMarketPrices.PriceDetails = [priceDetails];
                    }
                }
                else
                {
                    // Se card.CardMarketPrices è null, creane uno nuovo
                    card.CardMarketPrices = new PokemonCardMarketPrices
                    {
                        PokemonCardId = card.Id,
                        PokemonCard = card,
                        UpdatedAt = updatedAt,
                        Url = cardDto.Cardmarket?.Url?.ToString() ?? string.Empty,
                        PriceDetails = [priceDetails]
                    };
                }
            }
        }

        private static void UpdateTcgPlayerPrices(PokemonCardDto cardDto, PokemonCard card)
        {
            if (cardDto.Tcgplayer == null) return;

            // Ottieni la data di aggiornamento dal DTO
            var updatedAt = DateOnly.TryParse(cardDto.Tcgplayer.UpdatedAt, out var parsedDate) ? parsedDate : DateOnly.FromDateTime(DateTime.Today);

            // Verifica se esiste già un record per i prezzi di TcgPlayer per questa data
            var existingPrices = card.TcgPlayerPrices;
            
            if (existingPrices == null || existingPrices.UpdatedAt != updatedAt)
            {
                // Se non esiste un record per questa data, creane uno nuovo
                card.TcgPlayerPrices = new PokemonTcgPlayerPrices
                {
                    PokemonCardId = card.Id,
                    PokemonCard = card,
                    Url = cardDto.Tcgplayer.Url?.ToString() ?? string.Empty,
                    UpdatedAt = updatedAt,
                    PriceDetails = []
                };
            }
            else
            {
                // Aggiorna solo l'URL se il record per questa data esiste già
                // Verifica che card.TcgPlayerPrices non sia null prima di accedere alle sue proprietà
                if (card.TcgPlayerPrices != null)
                {
                    card.TcgPlayerPrices.Url = cardDto.Tcgplayer.Url?.ToString() ?? card.TcgPlayerPrices.Url ?? string.Empty;
                }
            }

            // Assicurati che card.TcgPlayerPrices non sia null e che abbia una collezione PriceDetails
            if (card.TcgPlayerPrices == null)
            {
                card.TcgPlayerPrices = new PokemonTcgPlayerPrices
                {
                    PokemonCardId = card.Id,
                    PokemonCard = card,
                    UpdatedAt = updatedAt,
                    Url = cardDto.Tcgplayer?.Url?.ToString() ?? string.Empty,
                    PriceDetails = []
                };
            }
            else if (card.TcgPlayerPrices.PriceDetails == null)
            {
                card.TcgPlayerPrices.PriceDetails = [];
            }
            
            // Gestisci i prezzi Holofoil
            if (cardDto.Tcgplayer?.TcgplayerPrices?.Holofoil != null)
            {
                // Cerca un record esistente per questo tipo di foil
                var existingHolofoil = card.TcgPlayerPrices.PriceDetails
                    .FirstOrDefault(pd => pd.PokemonCardId == card.Id && 
                                         pd.UpdatedAt == updatedAt && 
                                         pd.FoilType == "Holofoil");

                if (existingHolofoil != null)
                {
                    // Aggiorna il record esistente
                    existingHolofoil.Low = cardDto.Tcgplayer.TcgplayerPrices.Holofoil.Low;
                    existingHolofoil.Mid = cardDto.Tcgplayer.TcgplayerPrices.Holofoil.Mid;
                    existingHolofoil.High = cardDto.Tcgplayer.TcgplayerPrices.Holofoil.High;
                    existingHolofoil.Market = cardDto.Tcgplayer.TcgplayerPrices.Holofoil.Market;
                    existingHolofoil.DirectLow = cardDto.Tcgplayer.TcgplayerPrices.Holofoil.DirectLow;
                }
                else
                {
                    // Crea un nuovo record
                    var holofoilPrices = new PokemonTcgPlayerPriceDetails
                    {
                        PokemonCardId = card.Id,
                        UpdatedAt = updatedAt,
                        PokemonTcgPlayerPrices = card.TcgPlayerPrices,
                        FoilType = "Holofoil",
                        Low = cardDto.Tcgplayer.TcgplayerPrices.Holofoil.Low,
                        Mid = cardDto.Tcgplayer.TcgplayerPrices.Holofoil.Mid,
                        High = cardDto.Tcgplayer.TcgplayerPrices.Holofoil.High,
                        Market = cardDto.Tcgplayer.TcgplayerPrices.Holofoil.Market,
                        DirectLow = cardDto.Tcgplayer.TcgplayerPrices.Holofoil.DirectLow
                    };
                    card.TcgPlayerPrices.PriceDetails.Add(holofoilPrices);
                }
            }

            // Gestisci i prezzi ReverseHolofoil
            if (cardDto.Tcgplayer?.TcgplayerPrices?.ReverseHolofoil != null)
            {
                // Cerca un record esistente per questo tipo di foil
                var existingReverseHolofoil = card.TcgPlayerPrices.PriceDetails
                    .FirstOrDefault(pd => pd.PokemonCardId == card.Id && 
                                         pd.UpdatedAt == updatedAt && 
                                         pd.FoilType == "ReverseHolofoil");

                if (existingReverseHolofoil != null)
                {
                    // Aggiorna il record esistente
                    existingReverseHolofoil.Low = cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Low;
                    existingReverseHolofoil.Mid = cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Mid;
                    existingReverseHolofoil.High = cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.High;
                    existingReverseHolofoil.Market = cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Market;
                    existingReverseHolofoil.DirectLow = cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.DirectLow;
                }
                else
                {
                    // Crea un nuovo record
                    var reverseHolofoilPrices = new PokemonTcgPlayerPriceDetails
                    {
                        PokemonCardId = card.Id,
                        UpdatedAt = updatedAt,
                        PokemonTcgPlayerPrices = card.TcgPlayerPrices,
                        FoilType = "ReverseHolofoil",
                        Low = cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Low,
                        Mid = cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Mid,
                        High = cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.High,
                        Market = cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Market,
                        DirectLow = cardDto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.DirectLow
                    };
                    card.TcgPlayerPrices.PriceDetails.Add(reverseHolofoilPrices);
                }
            }

            // Gestisci i prezzi Normal
            if (cardDto.Tcgplayer?.TcgplayerPrices?.Normal != null)
            {
                // Cerca un record esistente per questo tipo di foil
                var existingNormal = card.TcgPlayerPrices.PriceDetails
                    .FirstOrDefault(pd => pd.PokemonCardId == card.Id && 
                                         pd.UpdatedAt == updatedAt && 
                                         pd.FoilType == "Normal");

                if (existingNormal != null)
                {
                    // Aggiorna il record esistente
                    existingNormal.Low = cardDto.Tcgplayer.TcgplayerPrices.Normal.Low;
                    existingNormal.Mid = cardDto.Tcgplayer.TcgplayerPrices.Normal.Mid;
                    existingNormal.High = cardDto.Tcgplayer.TcgplayerPrices.Normal.High;
                    existingNormal.Market = cardDto.Tcgplayer.TcgplayerPrices.Normal.Market;
                    existingNormal.DirectLow = cardDto.Tcgplayer.TcgplayerPrices.Normal.DirectLow;
                }
                else
                {
                    // Crea un nuovo record
                    var normalPrices = new PokemonTcgPlayerPriceDetails
                    {
                        PokemonCardId = card.Id,
                        UpdatedAt = updatedAt,
                        PokemonTcgPlayerPrices = card.TcgPlayerPrices,
                        FoilType = "Normal",
                        Low = cardDto.Tcgplayer.TcgplayerPrices.Normal.Low,
                        Mid = cardDto.Tcgplayer.TcgplayerPrices.Normal.Mid,
                        High = cardDto.Tcgplayer.TcgplayerPrices.Normal.High,
                        Market = cardDto.Tcgplayer.TcgplayerPrices.Normal.Market,
                        DirectLow = cardDto.Tcgplayer.TcgplayerPrices.Normal.DirectLow
                    };
                    card.TcgPlayerPrices.PriceDetails.Add(normalPrices);
                }
            }

            // Gestisci i prezzi 1stEditionHolofoil
            if (cardDto.Tcgplayer?.TcgplayerPrices?.The1stEditionHolofoil != null)
            {
                // Cerca un record esistente per questo tipo di foil
                var existing1stEdition = card.TcgPlayerPrices.PriceDetails
                    .FirstOrDefault(pd => pd.PokemonCardId == card.Id && 
                                         pd.UpdatedAt == updatedAt && 
                                         pd.FoilType == "1stEditionHolofoil");

                if (existing1stEdition != null)
                {
                    // Aggiorna il record esistente
                    existing1stEdition.Low = cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Low;
                    existing1stEdition.Mid = cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Mid;
                    existing1stEdition.High = cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.High;
                    existing1stEdition.Market = cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Market;
                    existing1stEdition.DirectLow = cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.DirectLow;
                }
                else
                {
                    // Crea un nuovo record
                    var firstEditionPrices = new PokemonTcgPlayerPriceDetails
                    {
                        PokemonCardId = card.Id,
                        UpdatedAt = updatedAt,
                        PokemonTcgPlayerPrices = card.TcgPlayerPrices,
                        FoilType = "1stEditionHolofoil",
                        Low = cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Low,
                        Mid = cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Mid,
                        High = cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.High,
                        Market = cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Market,
                        DirectLow = cardDto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.DirectLow
                    };
                    card.TcgPlayerPrices.PriceDetails.Add(firstEditionPrices);
                }
            }
        }
    }
}