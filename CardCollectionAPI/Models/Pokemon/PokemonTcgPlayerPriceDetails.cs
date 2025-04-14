using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CardCollectionAPI.Models
{
    public class PokemonTcgPlayerPriceDetails
    {
        // Chiavi esterne che fanno riferimento alla chiave primaria composita di PokemonTcgPlayerPrices
        public required string PokemonCardId { get; set; }
        public required DateOnly UpdatedAt { get; set; }
        
        public required PokemonTcgPlayerPrices PokemonTcgPlayerPrices { get; set; }

        public required string FoilType { get; set; } // "Holofoil" o "ReverseHolofoil"
        public decimal? Low { get; set; }
        public decimal? Mid { get; set; }
        public decimal? High { get; set; }
        public decimal? Market { get; set; }
        public decimal? DirectLow { get; set; }
    }
}
