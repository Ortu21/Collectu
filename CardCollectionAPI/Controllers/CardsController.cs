using Microsoft.AspNetCore.Mvc;
using CardCollectionAPI.Services;

namespace CardCollectionAPI.Controllers
{
    /// <summary>
    /// Controller per la gestione delle carte Pokémon
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PokemonCardController : ControllerBase
    {
        private readonly PokemonCardService _pokemonCardService;

        /// <summary>
        /// Inizializza una nuova istanza del controller
        /// </summary>
        /// <param name="pokemonCardService">Servizio per la gestione delle carte Pokémon</param>
        public PokemonCardController(PokemonCardService pokemonCardService)
        {
            _pokemonCardService = pokemonCardService;
        }

        /// <summary>
        /// Importa tutte le carte Pokémon
        /// </summary>
        /// <returns>Messaggio di conferma dell'importazione</returns>
        [HttpPost("import/")]
        public async Task<IActionResult> ImportPokemonCards()
        {
            await _pokemonCardService.ImportPokemonCardsAsync();
            return Ok("Importazione completata!");
        }
        
        /// <summary>
        /// Importa una singola carta Pokémon
        /// </summary>
        /// <param name="id">ID della carta da importare</param>
        /// <returns>Messaggio di conferma dell'importazione</returns>
        [HttpPost("import/{id}")]
        public async Task<IActionResult> ImportSingleCard(string id)
        {
            await _pokemonCardService.ImportSingleCardAsync(id);
            return Ok($"Importazione della carta {id} completata!");
        }
    }
}