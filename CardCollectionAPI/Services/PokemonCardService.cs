using System.Text.Json;
using CardCollectionAPI.Data;
using CardCollectionAPI.Models;
using CardCollectionAPI.Models.Dtos;
using CardCollectionAPI.Services.Interfaces;
using CardCollectionAPI.Services.Mappers;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Services
{
    public class PokemonCardService(HttpClient httpClient, AppDbContext dbContext, ILogger<PokemonCardService> logger) : IPokemonCardService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly AppDbContext _dbContext = dbContext;
        private readonly ILogger<PokemonCardService> _logger = logger;
        private readonly PokemonSetService _pokemonSetService = new(dbContext);
        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };
        private const string ApiUrl = "https://api.pokemontcg.io/v2/cards";
        private const string ApiKey = "3ddac7c9-24b0-4321-9ce3-658fbb16e27b";
        private int _currentPage = 1;
        private const int _pageSize = 250;

        public async Task ImportPokemonCardsAsync()
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, $"{ApiUrl}?page={_currentPage}&pageSize={_pageSize}");
                request.Headers.Add("X-Api-Key", ApiKey);

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"TCG API request failed with status code: {response.StatusCode}");
                    return;
                }

                var content = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonSerializer.Deserialize<PokemonApiResponse>(content, _jsonSerializerOptions);

                if (apiResponse == null || apiResponse.Data == null || apiResponse.Data.Count == 0)
                {
                    _logger.LogInformation("No cards found");
                    return;
                }

                foreach (var card in apiResponse.Data)
                {
                    await ProcessCardAsync(card);
                }

                await _dbContext.SaveChangesAsync();

                if (apiResponse.Data.Count < _pageSize)
                {
                    _logger.LogInformation("No more cards found");
                    return;
                }

                _currentPage++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during Pokémon card import");
            }
        }

        public async Task ProcessCardAsync(PokemonCardDto cardDto)
        {
            // Recupera o crea il set della carta
            var set = await _pokemonSetService.GetOrCreateSetAsync(cardDto.Set);

            // Controlla se la carta esiste già
            var existingCard = await _dbContext.PokemonCards
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == cardDto.Id);

            if (existingCard == null)
            {
                var card = PokemonCardMapper.MapDtoToEntity(cardDto);
                card.SetId = set.SetId; // Assegna l'ID del set corretto

                _dbContext.PokemonCards.Add(card);
            }
            else
            {
                _logger.LogWarning($"La carta {cardDto.Name} (ID: {cardDto.Id}) esiste già e non verrà reinserita.");
            }
        }



        public async Task ImportSingleCardAsync(string cardId)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, $"{ApiUrl}/{cardId}");
                request.Headers.Add("X-Api-Key", ApiKey);

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"TCG API request failed with status code: {response.StatusCode}");
                    return;
                }

                var content = await response.Content.ReadAsStringAsync();
                var cardDto = JsonSerializer.Deserialize<SingleCardResponse>(content, _jsonSerializerOptions)?.Data;

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

        public class SingleCardResponse
        {
            public PokemonCardDto Data { get; set; } = null!;
        }

        public class PokemonApiResponse
        {
            public List<PokemonCardDto> Data { get; set; } = new();
        }
    }
}
