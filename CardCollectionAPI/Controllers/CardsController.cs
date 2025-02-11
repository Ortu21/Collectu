using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CardCollectionAPI.Services;

namespace CardCollectionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Solo utenti autenticati possono accedere
    public class PokemonCardController : ControllerBase
    {
        private readonly PokemonCardService _pokemonCardService;

        public PokemonCardController(PokemonCardService pokemonCardService)
        {
            _pokemonCardService = pokemonCardService;
        }

        [HttpPost("import")]
        public async Task<IActionResult> ImportPokemonCards()
        {
            await _pokemonCardService.ImportPokemonCardsAsync();
            return Ok("Importazione completata!");
        }
    }
}