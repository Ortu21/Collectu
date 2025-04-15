namespace CardCollectionAPI.Models.DTO
{
    public class RegisterUserDto
    {
        public required string FirebaseUid { get; set; }
        public required string Email { get; set; }
        public string? DisplayName { get; set; }
        public string? PhotoUrl { get; set; }
        public bool EmailVerified { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ProviderId { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime LastSignInTime { get; set; }
    }
} 