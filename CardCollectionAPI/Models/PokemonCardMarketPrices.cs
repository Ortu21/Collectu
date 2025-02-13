using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CardCollectionAPI.Models
{
    public class PokemonCardMarketPrices
    {
        [Key]
        public int Id { get; set; } // Cambio la PK a un int per evitare problemi con le FK

        [ForeignKey("PokemonCard")]
        public required string PokemonCardId { get; set; }
        public required PokemonCard PokemonCard { get; set; }

        public required string Url { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Relazione uno-a-molti con i dettagli dei prezzi
        public List<PokemonCardMarketPriceDetails> PriceDetails { get; set; } = [];
    }
}
