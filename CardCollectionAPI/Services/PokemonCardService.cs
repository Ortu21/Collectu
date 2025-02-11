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

        public async Task ImportCardsAsync()
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

        private async Task ProcessCardAsync(PokemonCardDto cardDto)
        {
            var existingCard = await _dbContext.PokemonCards
                .Include(c => c.Set)
                .Include(c => c.Price)
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
            card.ImageUrl = dto.Images.Large;

            card.Price ??= new PokemonPrice
            {
                PokemonCardId = card.Id,
                PokemonCard = card
            };

            card.Price.TcgLow = dto.Tcgplayer.Prices.Holofoil.Low;
            card.Price.TcgMid = dto.Tcgplayer.Prices.Holofoil.Mid;
            card.Price.TcgHigh = dto.Tcgplayer.Prices.Holofoil.High;
            card.Price.TcgMarket = dto.Tcgplayer.Prices.Holofoil.Market;
            card.Price.CardmarketLow = dto.Cardmarket.Prices.LowPrice;
            card.Price.CardmarketTrend = dto.Cardmarket.Prices.TrendPrice;
            card.Price.CardmarketReverseHolo = dto.Cardmarket.Prices.ReverseHoloTrend;
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
