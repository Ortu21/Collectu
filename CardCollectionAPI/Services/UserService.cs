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
                .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

            if (existingUser != null)
                throw new Exception("Email già in uso");

            // Crea il nuovo utente
            var user = new User
            {
                FirebaseUid = registerDto.FirebaseUid,
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName,
                PhotoUrl = registerDto.PhotoUrl,
                EmailVerified = registerDto.EmailVerified,
                PhoneNumber = registerDto.PhoneNumber,
                ProviderId = registerDto.ProviderId,
                CreationTime = registerDto.CreationTime,
                LastSignInTime = registerDto.LastSignInTime
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Restituisce la risposta
            return new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                PhotoUrl = user.PhotoUrl,
                EmailVerified = user.EmailVerified,
                CreationTime = user.CreationTime,
                LastSignInTime = user.LastSignInTime
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
                Email = user.Email,
                DisplayName = user.DisplayName,
                PhotoUrl = user.PhotoUrl,
                EmailVerified = user.EmailVerified,
                CreationTime = user.CreationTime,
                LastSignInTime = user.LastSignInTime
            };
        }

        public async Task<UserResponseDto?> GetUserByFirebaseUidAsync(string firebaseUid)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.FirebaseUid == firebaseUid);

            if (user == null)
                return null;

            return new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                PhotoUrl = user.PhotoUrl,
                EmailVerified = user.EmailVerified,
                CreationTime = user.CreationTime,
                LastSignInTime = user.LastSignInTime
            };
        }
    }
} 