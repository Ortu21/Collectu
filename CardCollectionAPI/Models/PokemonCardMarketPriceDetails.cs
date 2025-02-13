using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CardCollectionAPI.Models
{
    public class PokemonCardMarketPriceDetails
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("PokemonCardMarketPrices")]
        public int PokemonCardMarketPricesId { get; set; }
        public required PokemonCardMarketPrices PokemonCardMarketPrices { get; set; }
        
        public decimal? AverageSellPrice { get; set; }
        public decimal? LowPrice { get; set; }
        public decimal? TrendPrice { get; set; }
        public decimal? GermanProLow { get; set; }
        public decimal? SuggestedPrice { get; set; }
        public decimal? ReverseHoloSell { get; set; }
        public decimal? ReverseHoloLow { get; set; }
        public decimal? ReverseHoloTrend { get; set; }
        public decimal? LowPriceExPlus { get; set; }
        public decimal? Avg1 { get; set; }
        public decimal? Avg7 { get; set; }
        public decimal? Avg30 { get; set; }
        public decimal? ReverseHoloAvg1 { get; set; }
        public decimal? ReverseHoloAvg7 { get; set; }
        public decimal? ReverseHoloAvg30 { get; set; }
    }
}
