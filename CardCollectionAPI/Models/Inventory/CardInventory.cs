using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CardCollectionAPI.Models.User;

namespace CardCollectionAPI.Models
{
    [Table("CardInventory")]
    public class CardInventory
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        public string CardId { get; set; } = string.Empty;

        [Required]
        public string CardType { get; set; } = string.Empty; // "Pokemon", "YuGiOh", ecc.

        public int Quantity { get; set; }

        public string? Condition { get; set; }

        [ForeignKey("UserId")]
        public virtual Models.User.User User { get; set; } = null!;
    }
} 