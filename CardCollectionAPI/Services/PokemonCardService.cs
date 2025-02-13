using System.Text.Json;
using CardCollectionAPI.Data;
using CardCollectionAPI.Models;
using CardCollectionAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Services
{
    public class PokemonCardService
    {
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _dbContext;
        private readonly ILogger<PokemonCardService> _logger;
        private const string ApiUrl = "https://api.pokemontcg.io/v2/cards";
        private const string ApiKey = "3ddac7c9-24b0-4321-9ce3-658fbb16e27b";

        public PokemonCardService(HttpClient httpClient, AppDbContext dbContext, ILogger<PokemonCardService> logger)
        {
            _httpClient = httpClient;
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task ImportPokemonCardsAsync()
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Add("X-Api-Key", ApiKey);
                var response = await _httpClient.GetAsync(ApiUrl);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"TCG API request failed with status code: {response.StatusCode}");
                    return;
                }

                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var apiResponse = JsonSerializer.Deserialize<PokemonApiResponse>(content, options);

                if (apiResponse?.Data == null)
                {
                    _logger.LogWarning("No data received from TCG API");
                    return;
                }

                foreach (var cardDto in apiResponse.Data)
                {
                    await ProcessCardAsync(cardDto);
                }

                await _dbContext.SaveChangesAsync();
                _logger.LogInformation($"Successfully imported {apiResponse.Data.Count} Pokémon cards");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during Pokémon card import");
                throw;
            }
        }

        public async Task ImportSingleCardAsync(string cardId)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Add("X-Api-Key", ApiKey);
                var response = await _httpClient.GetAsync($"{ApiUrl}/{cardId}");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"TCG API request failed with status code: {response.StatusCode}");
                    return;
                }

                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var cardDto = JsonSerializer.Deserialize<SingleCardResponse>(content, options)?.Data;

                if (cardDto == null)
                {
                    _logger.LogWarning($"No data received from TCG API for card {cardId}");
                    return;
                }

                await ProcessCardAsync(cardDto);
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation($"Successfully imported card {cardId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred during import of card {cardId}");
                throw;
            }
        }

        // Aggiungi questa classe per gestire la risposta di una singola carta
        public class SingleCardResponse
        {
            public PokemonCardDto Data { get; set; } = null!;
        }

        private async Task ProcessCardAsync(PokemonCardDto cardDto)
        {
            var existingCard = await _dbContext.PokemonCards
                .Include(c => c.Set)
                .Include(c => c.CardMarketPrices)
                .Include(c => c.TcgPlayerPrices)
                .FirstOrDefaultAsync(c => c.Id == cardDto.Id);

            if (existingCard == null)
            {
                var newCard = MapDtoToEntity(cardDto);
                _dbContext.PokemonCards.Add(newCard);
            }
            else
            {
                UpdateExistingCard(existingCard, cardDto);
            }
        }

        private static void UpdateExistingCard(PokemonCard card, PokemonCardDto dto)
        {
            card.Name = dto.Name;
            card.Supertype = dto.Supertype;
            card.Hp = dto.Hp;
            card.EvolvesFrom = dto.EvolvesFrom;
            card.Rarity = dto.Rarity;
            card.ImageUrl = dto.Images.Large.ToString();

            // Gestione prezzi CardMarket
            card.CardMarketPrices ??= new PokemonCardMarketPrices
            {
                PokemonCardId = card.Id,
                PokemonCard = card,
                Url = dto.Cardmarket.Url.ToString(),
                UpdatedAt = DateTime.Parse(dto.Cardmarket.UpdatedAt)
            };

            card.CardMarketPrices.PriceDetails.Add(new PokemonCardMarketPriceDetails
            {
                PokemonCardMarketPricesId = card.CardMarketPrices.Id,
                PokemonCardMarketPrices = card.CardMarketPrices
            });

            card.CardMarketPriceDetails.AverageSellPrice = dto.Cardmarket.Prices.AverageSellPrice;
            card.CardMarketPriceDetails.LowPrice = dto.Cardmarket.Prices.LowPrice;
            card.CardMarketPriceDetails.TrendPrice = dto.Cardmarket.Prices.TrendPrice;
            card.CardMarketPriceDetails.GermanProLow = dto.Cardmarket.Prices.GermanProLow;
            card.CardMarketPriceDetails.SuggestedPrice = dto.Cardmarket.Prices.SuggestedPrice;
            card.CardMarketPriceDetails.ReverseHoloSell = dto.Cardmarket.Prices.ReverseHoloSell;
            card.CardMarketPriceDetails.ReverseHoloLow = dto.Cardmarket.Prices.ReverseHoloLow;
            card.CardMarketPriceDetails.ReverseHoloTrend = dto.Cardmarket.Prices.ReverseHoloTrend;
            card.CardMarketPriceDetails.LowPriceExPlus = dto.Cardmarket.Prices.LowPriceExPlus;
            card.CardMarketPriceDetails.Avg1 = dto.Cardmarket.Prices.Avg1;
            card.CardMarketPriceDetails.Avg7 = dto.Cardmarket.Prices.Avg7;
            card.CardMarketPriceDetails.Avg30 = dto.Cardmarket.Prices.Avg30;
            card.CardMarketPriceDetails.ReverseHoloAvg1 = dto.Cardmarket.Prices.ReverseHoloAvg1;
            card.CardMarketPriceDetails.ReverseHoloAvg7 = dto.Cardmarket.Prices.ReverseHoloAvg7;
            card.CardMarketPriceDetails.ReverseHoloAvg30 = dto.Cardmarket.Prices.ReverseHoloAvg30;

            // Gestione prezzi TCGPlayer
            card.TcgPlayerPrices.Add(new PokemonTcgPlayerPrices
            {
                PokemonCardId = card.Id,
                PokemonCard = card,
                Url = dto.Tcgplayer.Url,
                UpdatedAt = dto.Tcgplayer.UpdatedAt
            });

            // Prezzi Holofoil
            card.TcgPlayerPrices.PriceDetails ??= new PokemonTcgPlayerPriceDetails
            {
                PokemonTcgPlayerPricesId = card.TcgPlayerPrices.id,
                PokemonTcgPlayerPrices = card.TcgPlayerPrices,
                FoilType = "Holofoil"
            };

            card.TcgPlayerPriceDetails.Low = dto.Tcgplayer.Prices.Holofoil.Low;
            card.TcgPlayerPriceDetails.Mid = dto.Tcgplayer.Prices.Holofoil.Mid;
            card.TcgPlayerPriceDetails.High = dto.Tcgplayer.Prices.Holofoil.High;
            card.TcgPlayerPriceDetails.Market = dto.Tcgplayer.Prices.Holofoil.Market;
            card.TcgPlayerPriceDetails.DirectLow = dto.Tcgplayer.Prices.Holofoil.DirectLow;

            // Prezzi Reverse Holofoil
            card.TcgPlayerReverseHoloPriceDetails ??= new PokemonTcgPlayerPriceDetails
            {
                PokemonTcgPlayerPricesId = card.TcgPlayerPrices.PokemonCardId,
                PokemonTcgPlayerPrices = card.TcgPlayerPrices,
                FoilType = "ReverseHolofoil"
            };

            card.TcgPlayerReverseHoloPriceDetails.Low = dto.Tcgplayer.Prices.ReverseHolofoil.Low;
            card.TcgPlayerReverseHoloPriceDetails.Mid = dto.Tcgplayer.Prices.ReverseHolofoil.Mid;
            card.TcgPlayerReverseHoloPriceDetails.High = dto.Tcgplayer.Prices.ReverseHolofoil.High;
            card.TcgPlayerReverseHoloPriceDetails.Market = dto.Tcgplayer.Prices.ReverseHolofoil.Market;
            card.TcgPlayerReverseHoloPriceDetails.DirectLow = dto.Tcgplayer.Prices.ReverseHolofoil.DirectLow;
        }


        private static PokemonCard MapDtoToEntity(PokemonCardDto dto)
        {
            var card = new PokemonCard
            {
                Id = dto.Id,
                Name = dto.Name,
                Supertype = dto.Supertype,
                Hp = dto.Hp,
                EvolvesFrom = dto.EvolvesFrom,
                Rarity = dto.Rarity,
                ImageUrl = dto.Images.Large,
                Set = new PokemonSet
                {
                    SetName = dto.Set.Name,
                    Series = dto.Set.Series,
                    ReleaseDate = dto.Set.ReleaseDate,
                    LogoUrl = dto.Set.Images.Logo
                }
            };

            // Aggiungi gli attacchi
            card.Attacks = dto.Attacks.Select(a => new PokemonAttack
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,  // Aggiungi il riferimento alla carta
                Name = a.Name,
                Damage = a.Damage,
                Text = a.Text,
                Cost = string.Join(", ", a.Cost),
                ConvertedEnergyCost = a.ConvertedEnergyCost.ToString()
            }).ToList();

            // Aggiungi le debolezze
            card.Weaknesses = dto.Weaknesses.Select(w => new PokemonWeakness
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,  // Aggiungi il riferimento alla carta
                Type = w.Type,
                Value = w.Value
            }).ToList();

            // Aggiungi le resistenze
            card.Resistances = dto.Resistances.Select(r => new PokemonResistance
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,  // Aggiungi il riferimento alla carta
                Type = r.Type,
                Value = r.Value
            }).ToList();

            // Aggiungi il prezzo
            var price = new PokemonPrice
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,  // Aggiungi il riferimento alla carta
                TcgLow = dto.Tcgplayer.Prices.Holofoil.Low,
                TcgMid = dto.Tcgplayer.Prices.Holofoil.Mid,
                TcgHigh = dto.Tcgplayer.Prices.Holofoil.High,
                TcgMarket = dto.Tcgplayer.Prices.Holofoil.Market,
                CardmarketLow = dto.Cardmarket.Prices?.LowPrice,
                CardmarketTrend = dto.Cardmarket.Prices?.TrendPrice,
                CardmarketReverseHolo = dto.Cardmarket.Prices?.ReverseHoloTrend
            };
            card.Price = price;

            return card;
        }
    }

    public class PokemonApiResponse
    {
        public List<PokemonCardDto> Data { get; set; } = new();
    }
}
