using System.ComponentModel.DataAnnotations;

namespace CardCollectionAPI.Models
{
    public class PokemonCard
    {
        [Key]
        public required string Id { get; set; } // ID univoco della carta

        public required string Name { get; set; } // Nome della carta

        public required string SetName { get; set; } // Nome del set

        public required string Rarity { get; set; } // Rarità della carta

        public required string ImageUrl { get; set; } // URL dell'immagine della carta

        public decimal? PriceLow { get; set; } // Prezzo minimo su TCGPlayer

        public decimal? PriceMid { get; set; } // Prezzo medio su TCGPlayer

        public decimal? PriceHigh { get; set; } // Prezzo massimo su TCGPlayer
    }
}
