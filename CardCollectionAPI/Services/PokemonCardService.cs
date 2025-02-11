using System.Text.Json;
using CardCollectionAPI.Data;
using CardCollectionAPI.Models;
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

            if (!_httpClient.DefaultRequestHeaders.Contains("X-Api-Key"))
            {
                _httpClient.DefaultRequestHeaders.Add("X-Api-Key", ApiKey);
            }
        }

        public async Task ImportPokemonCardsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync(ApiUrl);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"Errore API: {response.StatusCode}");
                    return;
                }

                var content = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonSerializer.Deserialize<PokemonApiResponse>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (apiResponse?.Data == null)
                {
                    _logger.LogWarning("Nessun dato ricevuto dall'API.");
                    return;
                }

                foreach (var card in apiResponse.Data)
                {
                    await AddOrUpdatePokemonCardAsync(card);
                }

                await _dbContext.SaveChangesAsync();
                _logger.LogInformation("Dati delle carte Pokémon aggiornati con successo.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Errore durante l'importazione delle carte: {ex.Message}");
            }
        }

        private async Task AddOrUpdatePokemonCardAsync(PokemonCardDto cardDto)
        {
            var existingCard = await _dbContext.PokemonCards
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == cardDto.Id);

            var set = await _dbContext.PokemonSets.FirstOrDefaultAsync(s => s.SetName == cardDto.Set.Name);
            if (set == null)
            {
                set = new PokemonSet
                {
                    SetName = cardDto.Set.Name,
                    Series = cardDto.Set.Series,
                    ReleaseDate = cardDto.Set.ReleaseDate,
                    LogoUrl = cardDto.Set.Images.Logo
                };
                _dbContext.PokemonSets.Add(set);
            }

            var pokemonCard = new PokemonCard
            {
                Id = cardDto.Id,
                Name = cardDto.Name,
                Supertype = cardDto.Supertype,
                Hp = cardDto.Hp,
                EvolvesFrom = cardDto.EvolvesFrom,
                Rarity = cardDto.Rarity,
                ImageUrl = cardDto.Images?.Large,
                Set = set,
                Attacks = cardDto.Attacks?.Select(a => new PokemonAttack
                {
                    Name = a.Name,
                    Damage = a.Damage,
                    Text = a.Text,
                    Cost = string.Join(",", a.Cost),
                    ConvertedEnergyCost = a.ConvertedEnergyCost
                }).ToList(),
                Weaknesses = cardDto.Weaknesses?.Select(w => new PokemonWeakness
                {
                    Type = w.Type,
                    Value = w.Value
                }).ToList(),
                Resistances = cardDto.Resistances?.Select(r => new PokemonResistance
                {
                    Type = r.Type,
                    Value = r.Value
                }).ToList(),
                Price = new PokemonPrice
                {
                    TcgLow = cardDto.Tcgplayer?.Prices?.Holofoil?.Low,
                    TcgMid = cardDto.Tcgplayer?.Prices?.Holofoil?.Mid,
                    TcgHigh = cardDto.Tcgplayer?.Prices?.Holofoil?.High,
                    TcgMarket = cardDto.Tcgplayer?.Prices?.Holofoil?.Market,
                    CardmarketLow = cardDto.Cardmarket?.Prices?.LowPrice,
                    CardmarketTrend = cardDto.Cardmarket?.Prices?.TrendPrice,
                    CardmarketReverseHolo = cardDto.Cardmarket?.Prices?.ReverseHoloTrend
                }
            };

            if (existingCard == null)
            {
                _dbContext.PokemonCards.Add(pokemonCard);
            }
            else
            {
                _dbContext.PokemonCards.Update(pokemonCard);
            }
        }
    }
}
