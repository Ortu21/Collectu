using System.ComponentModel.DataAnnotations;

namespace CardCollectionAPI.Models
{
    public class PokemonCard
    {
        [Key]
        public required string Id { get; set; } // ID univoco della carta

        public required string Name { get; set; } // Nome della carta

        public required string Supertype { get; set; } // "Pokémon" o altro

        public required string Hp { get; set; } // Punti vita

        public required string EvolvesFrom { get; set; } // Da quale Pokémon evolve

        public required string Rarity { get; set; } // Rarità

        public required string ImageUrl { get; set; } // URL immagine

        public int SetId { get; set; } // Relazione con il Set
        public required PokemonSet Set { get; set; }

        public List<PokemonAttack> Attacks { get; set; } = [];
        public List<PokemonWeakness> Weaknesses { get; set; } = [];
        public List<PokemonResistance> Resistances { get; set; } = [];

        public required PokemonPrice Price { get; set; } // Prezzi della carta
    }
}
