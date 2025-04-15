using System.ComponentModel.DataAnnotations;

namespace CardCollectionAPI.Models
{
    public class CardInventory
    {
        [Key]
        public int Id { get; set; }
        public required int UserId { get; set; }
        public required string CardId { get; set; }
        public required string CardType { get; set; } // "Pokemon", "YuGiOh", ecc.
        public int Quantity { get; set; }
        public string? Condition { get; set; }
    }
} 