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

        // CardMarket Prices
        public DbSet<PokemonCardMarketPrices> PokemonCardMarketPrices { get; set; }
        public DbSet<PokemonCardMarketPriceDetails> PokemonCardMarketPriceDetails { get; set; }

        // TCGPlayer Prices
        public DbSet<PokemonTcgPlayerPrices> PokemonCardTcgPrices { get; set; }
        public DbSet<PokemonTcgPlayerPriceDetails> PokemonCardTcgPriceDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
