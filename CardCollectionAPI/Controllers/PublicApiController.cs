using Microsoft.AspNetCore.Mvc;
using CardCollectionAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Controllers
{
    [Route("api/public")]
    [ApiController]
    public class PublicApiController(AppDbContext dbContext) : ControllerBase
    {
        private readonly AppDbContext _dbContext = dbContext;

        // GET: api/public/cards
        [HttpGet("cards")]
        public async Task<IActionResult> GetCards(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20, 
            [FromQuery] string? search = null, 
            [FromQuery] string? setId = null,
            [FromQuery] bool elasticSearch = false,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortOrder = "asc")
        {
            var query = _dbContext.PokemonCards
                .Include(c => c.Set)
                .AsQueryable();

            // Filtra per setId se specificato
            if (!string.IsNullOrEmpty(setId))
            {
                query = query.Where(c => c.Set != null && c.Set.SetId == setId);
            }
            
            // Applica filtro di ricerca avanzata se specificato
            if (!string.IsNullOrEmpty(search))
            {
                // Normalizza la stringa di ricerca
                search = search.Trim().ToLower();
                
                if (elasticSearch)
                {
                    // Elastic search mode: dividi la query in parole chiave e cerca in tutti i campi rilevanti
                    var keywords = search.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    
                    foreach (var keyword in keywords)
                    {
                        query = query.Where(c =>
                            EF.Functions.ILike(c.Name, $"%{keyword}%") ||
                            (c.EvolvesFrom != null && EF.Functions.ILike(c.EvolvesFrom, $"%{keyword}%")) ||
                            (c.Rarity != null && EF.Functions.ILike(c.Rarity, $"%{keyword}%")) ||
                            (c.Supertype != null && EF.Functions.ILike(c.Supertype, $"%{keyword}%")) ||
                            (c.Number != null && EF.Functions.ILike(c.Number, $"%{keyword}%")) ||
                            (c.Set != null && EF.Functions.ILike(c.Set.SetName, $"%{keyword}%"))
                        );
                    }
                }
                else
                {
                    // Ricerca standard che combina più campi e utilizza Contains per ricerca parziale
                    // Utilizziamo EF.Functions.Like per una ricerca case-insensitive
                    query = query.Where(c => 
                        EF.Functions.Like(c.Name.ToLower(), $"%{search}%") ||
                        (c.EvolvesFrom != null && EF.Functions.Like(c.EvolvesFrom.ToLower(), $"%{search}%")) ||
                        (c.Rarity != null && EF.Functions.Like(c.Rarity.ToLower(), $"%{search}%")) ||
                        (c.Number != null && EF.Functions.Like(c.Number.ToLower(), $"%{search}%")) ||
                        (c.Set != null && EF.Functions.Like(c.Set.SetName.ToLower(), $"%{search}%"))
                    );
                }
            }

            // Calcola il numero totale di carte che corrispondono alla query
            var totalCount = await query.CountAsync();

            // Applica ordinamento dinamico in base ai parametri
            IQueryable<CardCollectionAPI.Models.PokemonCard> orderedQuery;
            
            // Gestione dell'ordinamento dinamico
            if (!string.IsNullOrEmpty(sortBy))
            {
                // Converti sortBy in minuscolo per case-insensitive matching
                var sortField = sortBy.ToLower();
                var isAscending = sortOrder?.ToLower() != "desc";
                
                orderedQuery = sortField switch
                {
                    "name" => isAscending ? query.OrderBy(c => c.Name) : query.OrderByDescending(c => c.Name),
                    "number" => isAscending ? query.OrderBy(c => c.Number) : query.OrderByDescending(c => c.Number),
                    "rarity" => isAscending ? query.OrderBy(c => c.Rarity) : query.OrderByDescending(c => c.Rarity),
                    "set" => isAscending ? query.OrderBy(c => c.Set != null ? c.Set.SetName : "") : query.OrderByDescending(c => c.Set != null ? c.Set.SetName : ""),
                    "hp" => isAscending ? query.OrderBy(c => c.Hp) : query.OrderByDescending(c => c.Hp),
                    _ => query.OrderBy(c => c.Name) // Default ordinamento per nome
                };
            }
            else
            {
                // Ordinamento predefinito per nome
                orderedQuery = query.OrderBy(c => c.Name);
            }
            
            // Applica paginazione
            var cards = await orderedQuery
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
                    c.ImageUrl,
                    SetName = c.Set != null ? c.Set.SetName : null,
                    c.Number, // Aggiunto il campo Number alla risposta
                    // Aggiungi campo di rilevanza se è stata usata la ricerca elastica
                    // Nota: la rilevanza viene calcolata lato client poiché EF.Functions.ILike non può essere usato in proiezioni
                    Relevance = elasticSearch && !string.IsNullOrEmpty(search) ? 
                        search.Split(' ', StringSplitOptions.RemoveEmptyEntries).Count(k => c.Name.ToLower().Contains(k.ToLower())) : 0
                })
                .ToListAsync();

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                search,
                setId,
                elasticSearch,
                sortBy,
                sortOrder,
                data = cards
            });
        }

        // GET: api/public/search
        [HttpGet("search")]
        public async Task<IActionResult> SearchCards(
            [FromQuery] string query, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20,
            [FromQuery] string? setId = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortOrder = "asc")
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
                
            // Filtra per setId se specificato
            if (!string.IsNullOrEmpty(setId))
            {
                cardsQuery = cardsQuery.Where(c => c.Set != null && c.Set.SetId == setId);
            }

            // Applica filtri per ogni parola chiave
            foreach (var keyword in keywords)
            {
                cardsQuery = cardsQuery.Where(c =>
                    EF.Functions.ILike(c.Name, $"%{keyword}%") ||
                    (c.EvolvesFrom != null && EF.Functions.ILike(c.EvolvesFrom, $"%{keyword}%")) ||
                    (c.Rarity != null && EF.Functions.ILike(c.Rarity, $"%{keyword}%")) ||
                    (c.Supertype != null && EF.Functions.ILike(c.Supertype, $"%{keyword}%")) ||
                    (c.Number != null && EF.Functions.ILike(c.Number, $"%{keyword}%")) ||
                    (c.Set != null && EF.Functions.ILike(c.Set.SetName, $"%{keyword}%"))
                );
            }

            // Calcola il numero totale di risultati
            var totalCount = await cardsQuery.CountAsync();

            // Prepara la proiezione dei dati
            var projection = cardsQuery.Select(c => new
            {
                c.Id,
                c.Name,
                c.Supertype,
                c.Hp,
                c.EvolvesFrom,
                c.Rarity,
                c.ImageUrl,
                SetName = c.Set != null ? c.Set.SetName : null,
                c.Number,
                Relevance = keywords.Count(k => c.Name.ToLower().Contains(k.ToLower()))
            });
            
            // Applica ordinamento dinamico
            var orderedQuery = !string.IsNullOrEmpty(sortBy)
                ? ApplyDynamicOrdering(projection, sortBy, sortOrder)
                : projection.OrderByDescending(c => c.Relevance).ThenBy(c => c.Name);

            // Applica paginazione
            var results = await orderedQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                totalCount,
                page,
                pageSize,
                query,
                setId,
                sortBy,
                sortOrder,
                elasticSearch = true, // Sempre true per questo endpoint
                data = results
            });
        }
        
        // Metodo helper per applicare ordinamento dinamico
        private static IOrderedQueryable<T> ApplyDynamicOrdering<T>(IQueryable<T> query, string sortBy, string? sortOrder)
        {
            // Converti sortBy in minuscolo per case-insensitive matching
            var sortField = sortBy.ToLower();
            var isAscending = sortOrder?.ToLower() != "desc";
            
            // Utilizziamo reflection per applicare l'ordinamento dinamico
            var parameter = System.Linq.Expressions.Expression.Parameter(typeof(T), "x");
            var property = typeof(T).GetProperties()
                .FirstOrDefault(p => p.Name.Equals(sortField, StringComparison.OrdinalIgnoreCase));
            
            if (property == null)
            {
                // Se la proprietà non esiste, ordina per default (relevance o name)
                var defaultProperty = typeof(T).GetProperty("Relevance") ?? typeof(T).GetProperty("Name");
                if (defaultProperty == null) return (IOrderedQueryable<T>)query;
                
                var defaultExpression = System.Linq.Expressions.Expression.Property(parameter, defaultProperty);
                var defaultLambda = System.Linq.Expressions.Expression.Lambda(defaultExpression, parameter);
                var defaultMethod = isAscending ? "OrderBy" : "OrderByDescending";
                
                var defaultResult = typeof(Queryable).GetMethods()
                    .Where(m => m.Name == defaultMethod && m.IsGenericMethodDefinition && m.GetParameters().Length == 2)
                    .Single()
                    .MakeGenericMethod(typeof(T), defaultProperty.PropertyType)
                    .Invoke(null, [query, defaultLambda]);
                    
                return (IOrderedQueryable<T>)defaultResult!;
            }
            
            var expression = System.Linq.Expressions.Expression.Property(parameter, property);
            var lambda = System.Linq.Expressions.Expression.Lambda(expression, parameter);
            var methodName = isAscending ? "OrderBy" : "OrderByDescending";
            
            var result = typeof(Queryable).GetMethods()
                .Where(m => m.Name == methodName && m.IsGenericMethodDefinition && m.GetParameters().Length == 2)
                .Single()
                .MakeGenericMethod(typeof(T), property.PropertyType)
                .Invoke(null, [query, lambda]);
                
            return (IOrderedQueryable<T>)result!;
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
                .ThenInclude(p => p!.PriceDetails)
                .Include(c => c.TcgPlayerPrices)
                .ThenInclude(p => p!.PriceDetails)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (card == null)
            {
                return NotFound();
            }
            return Ok(card);
        }
        
        // GET: api/public/sets
        [HttpGet("sets")]
        public async Task<IActionResult> GetSets()
        {
            var sets = await _dbContext.PokemonSets
                .OrderByDescending(s => s.ReleaseDate)
                .Select(s => new
                {
                    setId = s.SetId,
                    setName = s.SetName,
                    series = s.Series,
                    releaseDate = s.ReleaseDate.ToString("yyyy-MM-dd"),
                    logoUrl = s.LogoUrl
                })
                .ToListAsync();

            return Ok(sets);
        }
    }
}