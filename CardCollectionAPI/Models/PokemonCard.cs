using System.ComponentModel.DataAnnotations;

namespace CardCollectionAPI.Models
{
    public class PokemonCard
    {
        [Key]
        public required string Id { get; set; } // ID univoco della carta
        public required string Name { get; set; } // Nome della carta
        public required string Supertype { get; set; } // "Pokémon" o altro
        public string? Hp { get; set; } // Punti vita
        public required string EvolvesFrom { get; set; } // Da quale Pokémon evolve
        public required string Rarity { get; set; } // Rarità
        public required string ImageUrl { get; set; } // URL immagine
        public string? SetId { get; set; } // Relazione con il Set
        public PokemonSet? Set { get; set; }

        public List<PokemonAttack> Attacks { get; set; } = [];
        public List<PokemonWeakness> Weaknesses { get; set; } = [];
        public List<PokemonResistance> Resistances { get; set; } = [];

        public PokemonCardMarketPrices? CardMarketPrices { get; set; } 
        public PokemonTcgPlayerPrices? TcgPlayerPrices { get; set; } 
    }
}
