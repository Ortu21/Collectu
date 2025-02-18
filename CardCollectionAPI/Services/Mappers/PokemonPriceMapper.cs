using CardCollectionAPI.Models;
using CardCollectionAPI.Models.Dtos;

namespace CardCollectionAPI.Services.Mappers
{
    public static class PokemonPriceMapper
    {
        public static PokemonCardMarketPrices? MapCardMarketPrices(PokemonCardDto dto, PokemonCard card)
        {
            if (dto.Cardmarket == null) return null;

            return new PokemonCardMarketPrices
            {
                PokemonCardId = card.Id,
                PokemonCard = card,
                Url = dto.Cardmarket.Url?.ToString() ?? string.Empty,
                UpdatedAt = DateOnly.TryParse(dto.Cardmarket.UpdatedAt, out var updatedAt) ? updatedAt : DateOnly.MinValue,
                PriceDetails =
                [
                    new PokemonCardMarketPriceDetails
                    {
                        PokemonCardMarketPrices = card.CardMarketPrices!,
                        AverageSellPrice = dto.Cardmarket?.CardmarketPrices.AverageSellPrice,
                        LowPrice = dto.Cardmarket?.CardmarketPrices.LowPrice,
                        TrendPrice = dto.Cardmarket?.CardmarketPrices.TrendPrice,
                        GermanProLow = dto.Cardmarket?.CardmarketPrices.GermanProLow,
                        SuggestedPrice = dto.Cardmarket?.CardmarketPrices.SuggestedPrice,
                        ReverseHoloSell = dto.Cardmarket?.CardmarketPrices.ReverseHoloSell,
                        ReverseHoloLow = dto.Cardmarket?.CardmarketPrices.ReverseHoloLow,
                        ReverseHoloTrend = dto.Cardmarket?.CardmarketPrices.ReverseHoloTrend,
                        LowPriceExPlus = dto.Cardmarket?.CardmarketPrices.LowPriceExPlus,
                        Avg1 = dto.Cardmarket?.CardmarketPrices.Avg1,
                        Avg7 = dto.Cardmarket?.CardmarketPrices.Avg7,
                        Avg30 = dto.Cardmarket?.CardmarketPrices.Avg30,
                        ReverseHoloAvg1 = dto.Cardmarket?.CardmarketPrices.ReverseHoloAvg1,
                        ReverseHoloAvg7 = dto.Cardmarket?.CardmarketPrices.ReverseHoloAvg7,
                        ReverseHoloAvg30 = dto.Cardmarket?.CardmarketPrices.ReverseHoloAvg30
                    }
                ]
            };
        }

        public static PokemonTcgPlayerPrices? MapTcgPlayerPrices(PokemonCardDto dto, PokemonCard card)
        {
            if (dto.Tcgplayer == null) return null;

            return new PokemonTcgPlayerPrices
            {
                PokemonCardId = card.Id,
                PokemonCard = card,
                Url = dto.Tcgplayer.Url?.ToString() ?? string.Empty,
                UpdatedAt = DateOnly.Parse(dto.Tcgplayer.UpdatedAt ?? DateTime.MinValue.ToString()),
                PriceDetails =
                [
                // Holofoil prices
                new PokemonTcgPlayerPriceDetails
                {
                    PokemonTcgPlayerPrices = card.TcgPlayerPrices!,
                    FoilType = "Holofoil",
                    Low = dto.Tcgplayer?.TcgplayerPrices?.Holofoil?.Low ?? 0,
                    Mid = dto.Tcgplayer?.TcgplayerPrices?.Holofoil?.Mid ?? 0,
                    High = dto.Tcgplayer?.TcgplayerPrices?.Holofoil?.High ?? 0,
                    Market = dto.Tcgplayer?.TcgplayerPrices?.Holofoil?.Market ?? 0,
                    DirectLow = dto.Tcgplayer?.TcgplayerPrices?.Holofoil?.DirectLow ?? 0
                },
                // Reverse Holofoil prices
                new PokemonTcgPlayerPriceDetails
                {
                    PokemonTcgPlayerPrices = card.TcgPlayerPrices!,
                    FoilType = "ReverseHolofoil",
                    Low = dto.Tcgplayer?.TcgplayerPrices?.ReverseHolofoil?.Low ?? 0,
                    Mid = dto.Tcgplayer?.TcgplayerPrices?.ReverseHolofoil?.Mid ?? 0,
                    High = dto.Tcgplayer?.TcgplayerPrices?.ReverseHolofoil?.High ?? 0,
                    Market = dto.Tcgplayer?.TcgplayerPrices?.ReverseHolofoil?.Market ?? 0,
                    DirectLow = dto.Tcgplayer?.TcgplayerPrices?.ReverseHolofoil?.DirectLow ?? 0
                },
                // Normal prices
                new PokemonTcgPlayerPriceDetails
                {
                    PokemonTcgPlayerPrices = card.TcgPlayerPrices!,
                    FoilType = "Normal",
                    Low = dto.Tcgplayer?.TcgplayerPrices?.Normal?.Low ?? 0,
                    Mid = dto.Tcgplayer?.TcgplayerPrices?.Normal?.Mid ?? 0,
                    High = dto.Tcgplayer?.TcgplayerPrices?.Normal?.High ?? 0,
                    Market = dto.Tcgplayer?.TcgplayerPrices?.Normal?.Market ?? 0,
                    DirectLow = dto.Tcgplayer?.TcgplayerPrices?.Normal?.DirectLow ?? 0
                },
                // 1st Edition Holofoil prices
                new PokemonTcgPlayerPriceDetails
                {
                    PokemonTcgPlayerPrices = card.TcgPlayerPrices!,
                    FoilType = "1stEditionHolofoil",
                    Low = dto.Tcgplayer?.TcgplayerPrices?.The1stEditionHolofoil?.Low ?? 0,
                    Mid = dto.Tcgplayer?.TcgplayerPrices?.The1stEditionHolofoil?.Mid ?? 0,
                    High = dto.Tcgplayer?.TcgplayerPrices?.The1stEditionHolofoil?.High ?? 0,
                    Market = dto.Tcgplayer?.TcgplayerPrices?.The1stEditionHolofoil?.Market ?? 0,
                    DirectLow = dto.Tcgplayer?.TcgplayerPrices?.The1stEditionHolofoil?.DirectLow ?? 0
                }
            ]
            };
        }
    }
}
