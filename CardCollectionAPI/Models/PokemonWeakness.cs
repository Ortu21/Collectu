using System.ComponentModel.DataAnnotations;

namespace CardCollectionAPI.Models
{
    public class PokemonWeakness
    {
        [Key]
        public int Id { get; set; }
        [Key]
        public required PokemonCard PokemonCard { get; set; }

        public required string Type { get; set; } // Tipo (es. "Fire")

        public required string Value { get; set; } // Valore (es. "x2")

        public required string PokemonCardId { get; set; }

    }
}
