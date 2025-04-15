using CardCollectionAPI.Data;
using CardCollectionAPI.Models.DTO;
using CardCollectionAPI.Models.User;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserResponseDto> RegisterUserAsync(RegisterUserDto registerDto)
        {
            // Verifica se l'utente esiste già
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == registerDto.UserName);

            if (existingUser != null)
                throw new Exception("Username già in uso");

            // Crea il nuovo utente
            var user = new User
            {
                UserName = registerDto.UserName,
                RegistrationDate = DateOnly.FromDateTime(DateTime.UtcNow)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Restituisce la risposta
            return new UserResponseDto
            {
                Id = user.Id,
                UserName = user.UserName,
                RegistrationDate = user.RegistrationDate
            };
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return null;

            return new UserResponseDto
            {
                Id = user.Id,
                UserName = user.UserName,
                RegistrationDate = user.RegistrationDate
            };
        }
    }
} 