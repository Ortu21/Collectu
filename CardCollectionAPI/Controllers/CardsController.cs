using Microsoft.AspNetCore.Mvc;
using CardCollectionAPI.Services;

namespace CardCollectionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class PokemonCardController : ControllerBase
    {
        private readonly PokemonCardService _pokemonCardService;

        public PokemonCardController(PokemonCardService pokemonCardService)
        {
            _pokemonCardService = pokemonCardService;
        }

        [HttpPost("import/")]
        public async Task<IActionResult> ImportPokemonCards()
        {
            await _pokemonCardService.ImportPokemonCardsAsync();
            return Ok("Importazione completata!");
        }
        
        [HttpPost("import/{id}")]
        public async Task<IActionResult> ImportSingleCard(string id)
        {
            await _pokemonCardService.ImportSingleCardAsync(id);
            return Ok($"Importazione della carta {id} completata!");
        }
    }
}