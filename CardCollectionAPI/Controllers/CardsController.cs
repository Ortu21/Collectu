using Microsoft.AspNetCore.Mvc;
using CardCollectionAPI.Services;
using CardCollectionAPI.Services.Interfaces;

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
        private readonly IPokemonPriceService _pokemonPriceService;

        /// <summary>
        /// Inizializza una nuova istanza del controller
        /// </summary>
        /// <param name="pokemonCardService">Servizio per la gestione delle carte Pokémon</param>
        /// <param name="pokemonPriceService">Servizio per l'aggiornamento dei prezzi delle carte Pokémon</param>
        public PokemonCardController(PokemonCardService pokemonCardService, IPokemonPriceService pokemonPriceService)
        {
            _pokemonCardService = pokemonCardService;
            _pokemonPriceService = pokemonPriceService;
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

        /// <summary>
        /// Aggiorna i prezzi di tutte le carte Pokémon esistenti nel database
        /// </summary>
        /// <returns>Messaggio di conferma dell'aggiornamento</returns>
        [HttpPost("update-prices")]
        public async Task<IActionResult> UpdateCardPrices()
        {
            await _pokemonPriceService.UpdateCardPricesAsync();
            return Ok("Aggiornamento prezzi di tutte le carte completato!");
        }
        
        /// <summary>
        /// Aggiorna i prezzi di una singola carta Pokémon
        /// </summary>
        /// <param name="id">ID della carta da aggiornare</param>
        /// <returns>Messaggio di conferma dell'aggiornamento</returns>
        [HttpPost("update-prices/{id}")]
        public async Task<IActionResult> UpdateSingleCardPrice(string id)
        {
            await _pokemonPriceService.UpdateSingleCardPriceAsync(id);
            return Ok($"Aggiornamento prezzi della carta {id} completato!");
        }
    }
}