namespace CardCollectionAPI.Models.DTO
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? PhotoUrl { get; set; }
        public bool EmailVerified { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime LastSignInTime { get; set; }
    }
} 