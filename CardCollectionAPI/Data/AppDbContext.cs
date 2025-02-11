using CardCollectionAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<PokemonCard> PokemonCards { get; set; }
        public DbSet<PokemonSet> PokemonSets { get; set; }
        public DbSet<PokemonAttack> PokemonAttacks { get; set; }
        public DbSet<PokemonWeakness> PokemonWeaknesses { get; set; }
        public DbSet<PokemonResistance> PokemonResistances { get; set; }
        public DbSet<PokemonPrice> PokemonPrices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PokemonPrice>()
                .HasOne(p => p.PokemonCard)
                .WithOne(c => c.Price)
                .HasForeignKey<PokemonPrice>(p => p.PokemonCardId);
        }
    }
}
