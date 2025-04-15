namespace CardCollectionAPI.Models.DTO
{
    public class RegisterUserDto
    {
        public required string FirebaseUid { get; set; }
        public required string UserName { get; set; }
    }

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateOnly RegistrationDate { get; set; }
    }
} 