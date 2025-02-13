using System.ComponentModel.DataAnnotations;

namespace CardCollectionAPI.Models
{
    public class PokemonSet
    {
        [Key]
        public int Id { get; set; }
        public required string SetName { get; set; } // Nome del Set
        public required string Series { get; set; } // Serie (es. "HeartGold & SoulSilver")
        public required DateTime ReleaseDate { get; set; } // Data rilascio
        public required string LogoUrl { get; set; } // URL logo
        public List<PokemonCard> Cards { get; set; } = [];
    }
}
