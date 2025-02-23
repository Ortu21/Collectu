using System.Text.Json;
using CardCollectionAPI.Data;
using CardCollectionAPI.Models.Dtos;
using CardCollectionAPI.Services.Interfaces;
using CardCollectionAPI.Services.Mappers;
using Microsoft.EntityFrameworkCore;
using static CardCollectionAPI.Services.PokemonCardService;

namespace CardCollectionAPI.Services
{
    public class PokemonCardService : IPokemonCardService
    {
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _dbContext;
        private readonly ILogger<PokemonCardService> _logger;
        private const string ApiUrl = "https://api.pokemontcg.io/v2/cards";
        private const string ApiKey = "";

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
                if (!response.IsSuccessStatusCode) return;

                var content = await response.Content.ReadAsStringAsync();
                var apiResponse = JsonSerializer.Deserialize<PokemonApiResponse>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (apiResponse?.Data == null) return;

                foreach (var cardDto in apiResponse.Data)
                {
                    await ProcessCardAsync(cardDto);
                }

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during Pokémon card import");
            }
        }

        private async Task ProcessCardAsync(PokemonCardDto cardDto)
        {
            var card = PokemonCardMapper.MapDtoToEntity(cardDto);
            card.CardMarketPrices = PokemonPriceMapper.MapCardMarketPrices(cardDto, card);
            card.TcgPlayerPrices = PokemonPriceMapper.MapTcgPlayerPrices(cardDto, card);

            await _dbContext.SaveChangesAsync();
        }

        public Task ImportSingleCardAsync(string cardId)
        {
            throw new NotImplementedException();
        }

        public class PokemonApiResponse
        {
            public List<PokemonCardDto> Data { get; set; } = new();
        }
    }
}
