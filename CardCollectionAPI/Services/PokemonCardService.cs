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
                .Include(c => c.Attacks)
                .Include(c => c.Weaknesses)
                .Include(c => c.Resistances)
                .Include(c => c.CardMarketPrices)
                .Include(c => c.TcgPlayerPrices)
                .FirstOrDefaultAsync(c => c.Id == cardDto.Id);

            if (existingCard == null)
            {
                // Mappa e aggiungi la carta senza i prezzi
                var newCard = MapDtoToEntity(cardDto);
                _dbContext.PokemonCards.Add(newCard);
                await _dbContext.SaveChangesAsync(); // Salva la carta

                // Ora aggiorna separatamente i prezzi
                newCard.CardMarketPrices = MapCardMarketPrices(cardDto, newCard);
                newCard.TcgPlayerPrices = MapTcgPlayerPrices(cardDto, newCard);
                _dbContext.PokemonCards.Update(newCard);
            }
            else
            {
                // Aggiorna la carta esistente (escludendo i prezzi, se necessario)
                UpdateExistingCard(existingCard, cardDto);
                // Aggiorna i prezzi
                existingCard.CardMarketPrices = MapCardMarketPrices(cardDto, existingCard);
                existingCard.TcgPlayerPrices = MapTcgPlayerPrices(cardDto, existingCard);
                _dbContext.PokemonCards.Update(existingCard);
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

            card.CardMarketPrices.PriceDetails.First().AverageSellPrice = dto.Cardmarket.CardmarketPrices.AverageSellPrice;
            card.CardMarketPrices.PriceDetails.First().LowPrice = dto.Cardmarket.CardmarketPrices.LowPrice;
            card.CardMarketPrices.PriceDetails.First().TrendPrice = dto.Cardmarket.CardmarketPrices.TrendPrice;
            card.CardMarketPrices.PriceDetails.First().GermanProLow = dto.Cardmarket.CardmarketPrices.GermanProLow;
            card.CardMarketPrices.PriceDetails.First().SuggestedPrice = dto.Cardmarket.CardmarketPrices.SuggestedPrice;
            card.CardMarketPrices.PriceDetails.First().ReverseHoloSell = dto.Cardmarket.CardmarketPrices.ReverseHoloSell;
            card.CardMarketPrices.PriceDetails.First().ReverseHoloLow = dto.Cardmarket.CardmarketPrices.ReverseHoloLow;
            card.CardMarketPrices.PriceDetails.First().ReverseHoloTrend = dto.Cardmarket.CardmarketPrices.ReverseHoloTrend;
            card.CardMarketPrices.PriceDetails.First().LowPriceExPlus = dto.Cardmarket.CardmarketPrices.LowPriceExPlus;
            card.CardMarketPrices.PriceDetails.First().Avg1 = dto.Cardmarket.CardmarketPrices.Avg1;
            card.CardMarketPrices.PriceDetails.First().Avg7 = dto.Cardmarket.CardmarketPrices.Avg7;
            card.CardMarketPrices.PriceDetails.First().Avg30 = dto.Cardmarket.CardmarketPrices.Avg30;
            card.CardMarketPrices.PriceDetails.First().ReverseHoloAvg1 = dto.Cardmarket.CardmarketPrices.ReverseHoloAvg1;
            card.CardMarketPrices.PriceDetails.First().ReverseHoloAvg7 = dto.Cardmarket.CardmarketPrices.ReverseHoloAvg7;
            card.CardMarketPrices.PriceDetails.First().ReverseHoloAvg30 = dto.Cardmarket.CardmarketPrices.ReverseHoloAvg30;

            // Gestione prezzi TCGPlayer
            card.TcgPlayerPrices ??= new PokemonTcgPlayerPrices
            {
                PokemonCardId = card.Id,
                PokemonCard = card,
                Url = dto.Tcgplayer.Url.ToString(),
                UpdatedAt = DateTime.Parse(dto.Tcgplayer.UpdatedAt)
            };

            // Prezzi Holofoil
            card.TcgPlayerPrices.PriceDetails.Add(new PokemonTcgPlayerPriceDetails
            {
                PokemonTcgPlayerPricesId = card.TcgPlayerPrices.Id,
                PokemonTcgPlayerPrices = card.TcgPlayerPrices,
                FoilType = "Holofoil"
            });

            card.TcgPlayerPrices.PriceDetails.First().Low = dto.Tcgplayer.TcgplayerPrices.Holofoil.Low;
            card.TcgPlayerPrices.PriceDetails.First().Mid = dto.Tcgplayer.TcgplayerPrices.Holofoil.Mid;
            card.TcgPlayerPrices.PriceDetails.First().High = dto.Tcgplayer.TcgplayerPrices.Holofoil.High;
            card.TcgPlayerPrices.PriceDetails.First().Market = dto.Tcgplayer.TcgplayerPrices.Holofoil.Market;
            card.TcgPlayerPrices.PriceDetails.First().DirectLow = dto.Tcgplayer.TcgplayerPrices.Holofoil.DirectLow;

            // Prezzi Reverse Holofoil
            card.TcgPlayerPrices.PriceDetails.Add(new PokemonTcgPlayerPriceDetails
            {
                PokemonTcgPlayerPricesId = card.TcgPlayerPrices.Id,
                PokemonTcgPlayerPrices = card.TcgPlayerPrices,
                FoilType = "ReverseHolofoil"
            });

            card.TcgPlayerPrices.PriceDetails.First().Low = dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Low;
            card.TcgPlayerPrices.PriceDetails.First().Mid = dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Mid;
            card.TcgPlayerPrices.PriceDetails.First().High = dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.High;
            card.TcgPlayerPrices.PriceDetails.First().Market = dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Market;
            card.TcgPlayerPrices.PriceDetails.First().DirectLow = dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.DirectLow;

            // Prezzi Normal
            card.TcgPlayerPrices.PriceDetails.Add(new PokemonTcgPlayerPriceDetails
            {
                PokemonTcgPlayerPricesId = card.TcgPlayerPrices.Id,
                PokemonTcgPlayerPrices = card.TcgPlayerPrices,
                FoilType = "Normal"
            });

            card.TcgPlayerPrices.PriceDetails.First().Low = dto.Tcgplayer.TcgplayerPrices.Normal.Low;
            card.TcgPlayerPrices.PriceDetails.First().Mid = dto.Tcgplayer.TcgplayerPrices.Normal.Mid;
            card.TcgPlayerPrices.PriceDetails.First().High = dto.Tcgplayer.TcgplayerPrices.Normal.High;
            card.TcgPlayerPrices.PriceDetails.First().Market = dto.Tcgplayer.TcgplayerPrices.Normal.Market;
            card.TcgPlayerPrices.PriceDetails.First().DirectLow = dto.Tcgplayer.TcgplayerPrices.Normal.DirectLow;

            // Prezzi 1st Edition Holofoil
            card.TcgPlayerPrices.PriceDetails.Add(new PokemonTcgPlayerPriceDetails
            {
                PokemonTcgPlayerPricesId = card.TcgPlayerPrices.Id,
                PokemonTcgPlayerPrices = card.TcgPlayerPrices,
                FoilType = "The1steditionholofoil"
            });

            card.TcgPlayerPrices.PriceDetails.First().Low = dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Low;
            card.TcgPlayerPrices.PriceDetails.First().Mid = dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Mid;
            card.TcgPlayerPrices.PriceDetails.First().High = dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.High;
            card.TcgPlayerPrices.PriceDetails.First().Market = dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Market;
            card.TcgPlayerPrices.PriceDetails.First().DirectLow = dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.DirectLow;

        }
        private static PokemonCard MapDtoToEntity(PokemonCardDto dto)
        {
            var card = new PokemonCard
            {
                Id = dto.Id,
                Name = dto.Name,
                Supertype = dto.Supertype,
                // Converti l'Hp da stringa a int (gestisci errori se necessario)
                Hp = dto.Hp,
                EvolvesFrom = dto.EvolvesFrom ?? string.Empty,
                Rarity = dto.Rarity,
                ImageUrl = dto.Images.Large.ToString(),
                Set = new PokemonSet
                {
                    SetName = dto.Set.Name,
                    Series = dto.Set.Series,
                    ReleaseDate = DateTime.Parse(dto.Set.ReleaseDate),
                    LogoUrl = dto.Set.Images.Logo.ToString(),
                },
                CardMarketPrices = null,
                TcgPlayerPrices = null,
            };
            card.Attacks = dto.Attacks.Select(a => new PokemonAttack
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,
                Name = a.Name,
                Damage = a.Damage,
                Text = a.Text,
                Cost = string.Join(", ", a.Cost),
                ConvertedEnergyCost = a.ConvertedEnergyCost.ToString(),
            }).ToList();
            card.Weaknesses = dto.Weaknesses.Select(w => new PokemonWeakness
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,
                Type = w.Type,
                Value = w.Value,
            }).ToList();
            card.Resistances = dto.Resistances.Select(r => new PokemonResistance
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,
                Type = r.Type,
                Value = r.Value,
            }).ToList();
            // Inizialmente i prezzi non vengono impostati
            return card;
        }


        private static PokemonCardMarketPrices MapCardMarketPrices(PokemonCardDto dto, PokemonCard card)
        {
            var cmp = new PokemonCardMarketPrices
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,
                Url = dto.Cardmarket.Url.ToString(),
                UpdatedAt = DateTime.Parse(dto.Cardmarket.UpdatedAt),
                PriceDetails = new List<PokemonCardMarketPriceDetails>
        {
            new PokemonCardMarketPriceDetails
            {
                PokemonCardMarketPrices = card.CardMarketPrices,
                AverageSellPrice = dto.Cardmarket.CardmarketPrices.AverageSellPrice,
                LowPrice = dto.Cardmarket.CardmarketPrices.LowPrice,
                TrendPrice = dto.Cardmarket.CardmarketPrices.TrendPrice,
                GermanProLow = dto.Cardmarket.CardmarketPrices.GermanProLow,
                SuggestedPrice = dto.Cardmarket.CardmarketPrices.SuggestedPrice,
                ReverseHoloSell = dto.Cardmarket.CardmarketPrices.ReverseHoloSell,
                ReverseHoloLow = dto.Cardmarket.CardmarketPrices.ReverseHoloLow,
                ReverseHoloTrend = dto.Cardmarket.CardmarketPrices.ReverseHoloTrend,
                LowPriceExPlus = dto.Cardmarket.CardmarketPrices.LowPriceExPlus,
                Avg1 = dto.Cardmarket.CardmarketPrices.Avg1,
                Avg7 = dto.Cardmarket.CardmarketPrices.Avg7,
                Avg30 = dto.Cardmarket.CardmarketPrices.Avg30,
                ReverseHoloAvg1 = dto.Cardmarket.CardmarketPrices.ReverseHoloAvg1,
                ReverseHoloAvg7 = dto.Cardmarket.CardmarketPrices.ReverseHoloAvg7,
                ReverseHoloAvg30 = dto.Cardmarket.CardmarketPrices.ReverseHoloAvg30
            }
        }
            };

            // Imposta il riferimento per ogni dettaglio
            foreach (var detail in cmp.PriceDetails)
            {
                detail.PokemonCardMarketPrices = cmp;
            }

            return cmp;
        }

        private static PokemonTcgPlayerPrices MapTcgPlayerPrices(PokemonCardDto dto, PokemonCard card)
        {
            var tp = new PokemonTcgPlayerPrices
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,
                Url = dto.Tcgplayer.Url.ToString(),
                UpdatedAt = DateTime.Parse(dto.Tcgplayer.UpdatedAt),
                PriceDetails = new List<PokemonTcgPlayerPriceDetails>
        {
            // Holofoil prices
            new PokemonTcgPlayerPriceDetails
            {
                PokemonTcgPlayerPrices = card.TcgPlayerPrices!,
                FoilType = "Holofoil",
                Low = dto.Tcgplayer.TcgplayerPrices.Holofoil.Low,
                Mid = dto.Tcgplayer.TcgplayerPrices.Holofoil.Mid,
                High = dto.Tcgplayer.TcgplayerPrices.Holofoil.High,
                Market = dto.Tcgplayer.TcgplayerPrices.Holofoil.Market,
                DirectLow = dto.Tcgplayer.TcgplayerPrices.Holofoil.DirectLow
            },
            // Reverse Holofoil prices
            new PokemonTcgPlayerPriceDetails
            {
                PokemonTcgPlayerPrices = card.TcgPlayerPrices!,
                FoilType = "ReverseHolofoil",
                Low = dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Low,
                Mid = dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Mid,
                High = dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.High,
                Market = dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.Market,
                DirectLow = dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil.DirectLow
            },
            // Normal prices
            new PokemonTcgPlayerPriceDetails
            {
                PokemonTcgPlayerPrices = card.TcgPlayerPrices!,
                FoilType = "Normal",
                Low = dto.Tcgplayer.TcgplayerPrices.Normal.Low,
                Mid = dto.Tcgplayer.TcgplayerPrices.Normal.Mid,
                High = dto.Tcgplayer.TcgplayerPrices.Normal.High,
                Market = dto.Tcgplayer.TcgplayerPrices.Normal.Market,
                DirectLow = dto.Tcgplayer.TcgplayerPrices.Normal.DirectLow
            },
            // 1st Edition Holofoil prices
            new PokemonTcgPlayerPriceDetails
            {
                PokemonTcgPlayerPrices = card.TcgPlayerPrices!,
                FoilType = "1stEditionHolofoil",
                Low = dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Low,
                Mid = dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Mid,
                High = dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.High,
                Market = dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.Market,
                DirectLow = dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil.DirectLow
            }
        }
            };

            foreach (var detail in tp.PriceDetails)
            {
                detail.PokemonTcgPlayerPrices = tp;
            }

            return tp;
        }


        public class PokemonApiResponse
        {
            public List<PokemonCardDto> Data { get; set; } = new();
        }
    }
}
