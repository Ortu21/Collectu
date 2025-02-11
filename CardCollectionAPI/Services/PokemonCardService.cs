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
        }

        public async Task ImportPokemonCardsAsync()
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Add("X-Api-Key", ApiKey);
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

                if (apiResponse?.Data == null) return;

                foreach (var card in apiResponse.Data)
                {
                    var existingCard = await _dbContext.PokemonCards.FindAsync(card.Id);
                    if (existingCard == null)
                    {
                        _dbContext.PokemonCards.Add(card);
                    }
                    else
                    {
                        existingCard.PriceLow = card.PriceLow;
                        existingCard.PriceMid = card.PriceMid;
                        existingCard.PriceHigh = card.PriceHigh;
                    }
                }

                await _dbContext.SaveChangesAsync();
                _logger.LogInformation("Dati delle carte Pokémon aggiornati con successo.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Errore durante l'importazione delle carte: {ex.Message}");
            }
        }
    }
}
