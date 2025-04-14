using System.ComponentModel.DataAnnotations;
using CardCollectionAPI.Models.Card;

namespace CardCollectionAPI.Models.Card
{
    public class PokemonCard
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Set { get; set; }
        public required string Number { get; set; }
        public required string Rarity { get; set; }
        public required string ImageUrl { get; set; }
        public required PokemonCardMarketPrices MarketPrices { get; set; }
        public ICollection<CardInventory> CardInventories { get; set; } = new List<CardInventory>();
    }
} 