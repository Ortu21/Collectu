using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CardCollectionAPI.Models
{
    public class PokemonTcgPlayerPrices
    {
        // Chiave primaria composita configurata nel DbContext
        [ForeignKey("PokemonCard")]
        public required string PokemonCardId { get; set; }
        public required PokemonCard PokemonCard { get; set; }

        public required DateOnly UpdatedAt { get; set; } // Parte della chiave primaria composita
        
        public required string Url { get; set; }

        // Relazione uno-a-molti con i dettagli dei prezzi
        public List<PokemonTcgPlayerPriceDetails> PriceDetails { get; set; } = [];
    }
}
