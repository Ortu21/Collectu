using CardCollectionAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public required DbSet<PokemonCard> PokemonCards { get; set; }
        public required DbSet<PokemonSet> PokemonSets { get; set; }
        public required DbSet<PokemonAttack> PokemonAttacks { get; set; }
        public required DbSet<PokemonWeakness> PokemonWeaknesses { get; set; }
        public required DbSet<PokemonResistance> PokemonResistances { get; set; }

        // CardMarket Prices
        public required DbSet<PokemonCardMarketPrices> PokemonCardMarketPrices { get; set; }
        public required DbSet<PokemonCardMarketPriceDetails> PokemonCardMarketPriceDetails { get; set; }

        // TCGPlayer Prices
        public required DbSet<PokemonTcgPlayerPrices> PokemonCardTcgPrices { get; set; }
        public required DbSet<PokemonTcgPlayerPriceDetails> PokemonCardTcgPriceDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            
            // Configurazione della chiave primaria composita per PokemonCardMarketPrices
            modelBuilder.Entity<PokemonCardMarketPrices>()
                .HasKey(p => new { p.PokemonCardId, p.UpdatedAt });
            
            // Configurazione della chiave primaria composita per PokemonTcgPlayerPrices
            modelBuilder.Entity<PokemonTcgPlayerPrices>()
                .HasKey(p => new { p.PokemonCardId, p.UpdatedAt });

            // Configurazione della chiave primaria composita per PokemonCardMarketPriceDetails
            // Aggiungiamo un campo discriminatore per evitare duplicazioni
            modelBuilder.Entity<PokemonCardMarketPriceDetails>()
                .HasKey(p => new { p.PokemonCardId, p.UpdatedAt });
            
            // Configurazione dell'indice per la ricerca efficiente
            modelBuilder.Entity<PokemonCardMarketPriceDetails>()
                .HasIndex(p => new { p.PokemonCardId, p.UpdatedAt});

            // Configurazione della relazione tra PokemonCardMarketPrices e PokemonCardMarketPriceDetails
            modelBuilder.Entity<PokemonCardMarketPriceDetails>()
                .HasOne(d => d.PokemonCardMarketPrices)
                .WithMany(p => p.PriceDetails)
                .HasForeignKey(d => new { d.PokemonCardId, d.UpdatedAt });

            // Configurazione della chiave primaria composita per PokemonTcgPlayerPriceDetails
            modelBuilder.Entity<PokemonTcgPlayerPriceDetails>()
                .HasKey(p => new { p.PokemonCardId, p.UpdatedAt, p.FoilType });

            // Configurazione della relazione tra PokemonTcgPlayerPrices e PokemonTcgPlayerPriceDetails
            modelBuilder.Entity<PokemonTcgPlayerPriceDetails>()
                .HasOne(d => d.PokemonTcgPlayerPrices)
                .WithMany(p => p.PriceDetails)
                .HasForeignKey(d => new { d.PokemonCardId, d.UpdatedAt });
        }
    }
}
