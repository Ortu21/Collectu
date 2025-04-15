using Microsoft.AspNetCore.Mvc;
using CardCollectionAPI.Models.User;
using CardCollectionAPI.Services;
using CardCollectionAPI.Models.DTO;

namespace CardCollectionAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserResponseDto>> RegisterUser([FromBody] RegisterUserDto registerDto)
        {
            try
            {
                var user = await _userService.RegisterUserAsync(registerDto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                    return NotFound(new { message = "Utente non trovato" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
} 