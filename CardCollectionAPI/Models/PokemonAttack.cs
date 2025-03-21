using System.ComponentModel.DataAnnotations;

namespace CardCollectionAPI.Models
{
    public class PokemonAttack
    {
        [Key]
        public int Id { get; set; }
        public required PokemonCard PokemonCard { get; set; }
        public required string Name { get; set; } // Nome attacco
        public string? Damage { get; set; } // Danno (es. "40")
        public required string Text { get; set; } // Descrizione effetto
        public required string Cost { get; set; } // Energia necessaria (es. "Metal, Colorless")
        public required string ConvertedEnergyCost { get; set; }
        public required string PokemonCardId { get; set; } // Relazione con la carta
    }
}
