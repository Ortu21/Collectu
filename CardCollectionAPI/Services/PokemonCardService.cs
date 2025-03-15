using System.Text.Json;
using CardCollectionAPI.Data;
using CardCollectionAPI.Models.Dtos;
using CardCollectionAPI.Services.Interfaces;
using CardCollectionAPI.Services.Mappers;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Services
{
    public class PokemonCardService(HttpClient httpClient, AppDbContext dbContext, ILogger<PokemonCardService> logger, IConfiguration configuration) : IPokemonCardService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly AppDbContext _dbContext = dbContext;
        private readonly ILogger<PokemonCardService> _logger = logger;
        private readonly PokemonSetService _pokemonSetService = new(dbContext);
        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };
        private const string ApiUrl = "https://api.pokemontcg.io/v2/cards";
        private readonly string _apiKey = configuration["PokemonTcg:ApiKey"] ?? throw new InvalidOperationException("API key for Pokemon TCG not found in configuration");
        private int _currentPage = 1;
        private const int _pageSize = 250;

        public async Task ImportPokemonCardsAsync()
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, $"{ApiUrl}?page={_currentPage}&pageSize={_pageSize}");
                request.Headers.Add("X-Api-Key", _apiKey);

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("TCG API request failed with status code: {StatusCode}", response.StatusCode);
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
                .Include(c => c.CardMarketPrices)
                .Include(c => c.TcgPlayerPrices)
                .FirstOrDefaultAsync(c => c.Id == cardDto.Id);

            if (existingCard == null)
            {
                // Crea una nuova carta
                var card = PokemonCardMapper.MapDtoToEntity(cardDto);
                card.SetId = set.SetId; // Assegna l'ID del set corretto

                // Aggiungi la carta al contesto
                _dbContext.PokemonCards.Add(card);
                await _dbContext.SaveChangesAsync();

                // Aggiungi i prezzi per la nuova carta
                PokemonPriceMapper.MapCardMarketPrices(cardDto, card);
                PokemonPriceMapper.MapTcgPlayerPrices(cardDto, card);
            }
            else
            {
                _logger.LogInformation("La carta {Name} (ID: {Id}) esiste già. Aggiornamento prezzi...", cardDto.Name, cardDto.Id);
                
                // Aggiungi nuovi record di prezzi per la carta esistente
                PokemonPriceMapper.MapCardMarketPrices(cardDto, existingCard);
                PokemonPriceMapper.MapTcgPlayerPrices(cardDto, existingCard);
            }
        }

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
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation("Successfully imported card {CardId}", cardId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during import of card {CardId}", cardId);
                throw;
            }
        }

        public class SingleCardResponse
        {
            public PokemonCardDto Data { get; set; } = null!;
        }

        public class PokemonApiResponse
        {
            public List<PokemonCardDto> Data { get; set; } = [];
        }
    }
}
