using Microsoft.EntityFrameworkCore;
using CardCollectionAPI.Models;

namespace CardCollectionAPI.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<PokemonCard> PokemonCards { get; set; }
    }
}
