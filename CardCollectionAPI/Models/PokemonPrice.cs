using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CardCollectionAPI.Models
{
    public class PokemonPrice
    {
        [Key]
        [ForeignKey("PokemonCard")]
        public required string PokemonCardId { get; set; }
        public required PokemonCard PokemonCard { get; set; }

        public decimal? TcgLow { get; set; }
        public decimal? TcgMid { get; set; }
        public decimal? TcgHigh { get; set; }
        public decimal? TcgMarket { get; set; }

        public decimal? CardmarketLow { get; set; }
        public decimal? CardmarketTrend { get; set; }
        public decimal? CardmarketReverseHolo { get; set; }
    }
}
