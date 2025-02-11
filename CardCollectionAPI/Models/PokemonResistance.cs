using System.ComponentModel.DataAnnotations;

namespace CardCollectionAPI.Models
{
    public class PokemonResistance
    {
        [Key]
        public int Id { get; set; }

        public required string Type { get; set; } // Tipo (es. "Psychic")

        public required string Value { get; set; } // Valore (es. "-20")

        public required string PokemonCardId { get; set; }
        public required PokemonCard PokemonCard { get; set; }
    }
}
