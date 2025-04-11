using CardCollectionAPI.Models;
using CardCollectionAPI.Models.Dtos;

namespace CardCollectionAPI.Services.Mappers
{
    public static class PokemonPriceMapper
    {
        /// <summary>
        /// Crea un oggetto PokemonCardMarketPrices a partire dai dati DTO e dall'ID della carta.
        /// Non effettua operazioni sul database.
        /// </summary>
        public static PokemonCardMarketPrices CreateCardMarketPrices(PokemonCardDto dto, string cardId, DateOnly updatedAt)
        {
            if (dto.Cardmarket?.CardmarketPrices == null) return null!;
            
            // Creo nuova testata
            var priceHeader = new PokemonCardMarketPrices
            {
                PokemonCardId = cardId,
                UpdatedAt = updatedAt,
                Url = dto.Cardmarket.Url?.ToString() ?? string.Empty,
                PriceDetails = [],
                PokemonCard = null!  // Sarà gestito automaticamente da EF Core
            };

            // Creo nuovi dettagli
            var priceDetails = new PokemonCardMarketPriceDetails
            {
                PokemonCardId = cardId,
                UpdatedAt = updatedAt,
                PokemonCardMarketPrices = priceHeader,
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
            };
            
            // Aggiungo i dettagli alla testata
            priceHeader.PriceDetails.Add(priceDetails);
            
            return priceHeader;
        }

        /// <summary>
        /// Crea un oggetto PokemonTcgPlayerPrices a partire dai dati DTO e dall'ID della carta.
        /// Non effettua operazioni sul database.
        /// </summary>
        public static PokemonTcgPlayerPrices CreateTcgPlayerPrices(PokemonCardDto dto, string cardId, DateOnly updatedAt)
        {
            if (dto.Tcgplayer?.TcgplayerPrices == null) return null!;
            
            // Creo nuova testata
            var priceHeader = new PokemonTcgPlayerPrices
            {
                PokemonCardId = cardId,
                UpdatedAt = updatedAt,
                Url = dto.Tcgplayer.Url?.ToString() ?? string.Empty,
                PriceDetails = [],
                PokemonCard = null!  // Sarà gestito automaticamente da EF Core
            };

            // Aggiungo i dettagli per ogni tipo di foil
            if (dto.Tcgplayer.TcgplayerPrices.Holofoil != null)
            {
                AddTcgPriceDetail(priceHeader, "Holofoil", dto.Tcgplayer.TcgplayerPrices.Holofoil, updatedAt);
            }
            if (dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil != null)
            {
                AddTcgPriceDetail(priceHeader, "ReverseHolofoil", dto.Tcgplayer.TcgplayerPrices.ReverseHolofoil, updatedAt);
            }
            if (dto.Tcgplayer.TcgplayerPrices.Normal != null)
            {
                AddTcgPriceDetail(priceHeader, "Normal", dto.Tcgplayer.TcgplayerPrices.Normal, updatedAt);
            }
            if (dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil != null)
            {
                AddTcgPriceDetail(priceHeader, "1stEditionHolofoil", dto.Tcgplayer.TcgplayerPrices.The1stEditionHolofoil, updatedAt);
            }
            
            return priceHeader;
        }

        /// <summary>
        /// Aggiunge un dettaglio di prezzo TCG Player alla testata.
        /// </summary>
        private static void AddTcgPriceDetail(PokemonTcgPlayerPrices header, string foilType, dynamic prices, DateOnly updatedAt)
        {
            var newDetail = new PokemonTcgPlayerPriceDetails
            {
                PokemonCardId = header.PokemonCardId,
                UpdatedAt = updatedAt,
                PokemonTcgPlayerPrices = header,
                FoilType = foilType,
                Low = prices?.Low ?? 0,
                Mid = prices?.Mid ?? 0,
                High = prices?.High ?? 0,
                Market = prices?.Market ?? 0,
                DirectLow = prices?.DirectLow ?? 0
            };

            header.PriceDetails.Add(newDetail);
        }

        /// <summary>
        /// Converte una stringa di data in un DateOnly.
        /// Restituisce la data corrente se la conversione fallisce.
        /// </summary>
        public static DateOnly ParseDateFromString(string? dateString)
        {
            return DateOnly.TryParse(dateString, out var parsedDate) 
                ? parsedDate 
                : DateOnly.FromDateTime(DateTime.Today);
        }
    }
}
