using Microsoft.AspNetCore.Mvc;
using CardCollectionAPI.Services;
using CardCollectionAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CardCollectionAPI.Models;

namespace CardCollectionAPI.Controllers
{
    [Route("api/public")]
    [ApiController]
    public class PublicApiController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public PublicApiController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/public/cards
        [HttpGet("cards")]
        public async Task<IActionResult> GetCards([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? search = null)
        {
            var query = _dbContext.PokemonCards
                .Include(c => c.Set)
                .AsQueryable();

            // Applica filtro di ricerca avanzata se specificato
            if (!string.IsNullOrEmpty(search))
            {
                // Normalizza la stringa di ricerca
                search = search.Trim().ToLower();
                
                // Ricerca intelligente che combina più campi e utilizza Contains per ricerca parziale
                // Utilizziamo EF.Functions.Like per una ricerca case-insensitive
                query = query.Where(c => 
                    EF.Functions.Like(c.Name.ToLower(), $"%{search}%") ||
                    (c.EvolvesFrom != null && EF.Functions.Like(c.EvolvesFrom.ToLower(), $"%{search}%")) ||
                    (c.Rarity != null && EF.Functions.Like(c.Rarity.ToLower(), $"%{search}%")) ||
                    (c.Set != null && EF.Functions.Like(c.Set.SetName.ToLower(), $"%{search}%"))
                );
            }

            // Calcola il numero totale di carte che corrispondono alla query
            var totalCount = await query.CountAsync();

            // Applica paginazione con ordinamento esplicito per garantire risultati consistenti
            var cards = await query
                .OrderBy(c => c.Name) // Aggiunto ordinamento esplicito per evitare risultati imprevedibili
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Supertype,
                    c.Hp,
                    c.EvolvesFrom,
                    c.Rarity,
                    ImageUrl = c.ImageUrl,
                    SetName = c.Set != null ? c.Set.SetName : null
                })
                .ToListAsync();

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                data = cards
            });
        }

        // GET: api/public/search
        [HttpGet("search")]
        public async Task<IActionResult> SearchCards([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Il parametro di ricerca non può essere vuoto");
            }

            // Normalizza la query di ricerca
            query = query.Trim().ToLower();
            
            // Dividi la query in parole chiave
            var keywords = query.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            var cardsQuery = _dbContext.PokemonCards
                .Include(c => c.Set)
                .AsQueryable();

            // Applica filtri per ogni parola chiave
            foreach (var keyword in keywords)
            {
                cardsQuery = cardsQuery.Where(c =>
                    c.Name.ToLower().Contains(keyword) ||
                    (c.EvolvesFrom != null && c.EvolvesFrom.ToLower().Contains(keyword)) ||
                    (c.Rarity != null && c.Rarity.ToLower().Contains(keyword)) ||
                    (c.Supertype != null && c.Supertype.ToLower().Contains(keyword)) ||
                    (c.Set != null && c.Set.SetName.ToLower().Contains(keyword))
                );
            }

            // Calcola il numero totale di risultati
            var totalCount = await cardsQuery.CountAsync();

            // Applica paginazione
            var results = await cardsQuery
                // Calcola un punteggio di rilevanza basato su quante parole chiave corrispondono al nome
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Supertype,
                    c.Hp,
                    c.EvolvesFrom,
                    c.Rarity,
                    ImageUrl = c.ImageUrl,
                    SetName = c.Set != null ? c.Set.SetName : null,
                    Relevance = keywords.Count(k => c.Name.ToLower().Contains(k))
                })
                .OrderByDescending(c => c.Relevance) // Ordina per rilevanza
                .ThenBy(c => c.Name) // Aggiunto ordinamento secondario per garantire risultati consistenti
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                query,
                data = results
            });
        }

        // GET: api/public/cards/{id}
        [HttpGet("cards/{id}")]
        public async Task<IActionResult> GetCardById(string id)
        {
            var card = await _dbContext.PokemonCards
                .Include(c => c.Set)
                .Include(c => c.Attacks)
                .Include(c => c.Weaknesses)
                .Include(c => c.Resistances)
                .Include(c => c.CardMarketPrices)
                .Include(c => c.TcgPlayerPrices)
                .ThenInclude(p => p.PriceDetails)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (card == null)
            {
                return NotFound();
            }

            return Ok(card);
        }
    }
}