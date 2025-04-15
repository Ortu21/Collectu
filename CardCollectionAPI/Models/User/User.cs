using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CardCollectionAPI.Models;

namespace CardCollectionAPI.Models.User
{
    [Table("Users")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FirebaseUid { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        public string? DisplayName { get; set; }

        public string? PhotoUrl { get; set; }

        public bool EmailVerified { get; set; }

        public string? PhoneNumber { get; set; }

        public string? ProviderId { get; set; }

        public DateTime CreationTime { get; set; }

        public DateTime LastSignInTime { get; set; }

        // Campi aggiuntivi per la gestione delle collezioni
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Relazioni
        [InverseProperty("User")]
        public virtual ICollection<CardInventory> CardInventory { get; set; } = new List<CardInventory>();
    }
} 