using CardCollectionAPI.Models;
using CardCollectionAPI.Models.User;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public required DbSet<User> Users { get; set; }
        public required DbSet<PokemonCard> PokemonCards { get; set; }
        public required DbSet<CardInventory> CardInventories { get; set; }
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

            modelBuilder.Entity<User>(entity => 
            {
                entity.HasKey(x => x.Id);

                entity.HasIndex(x => x.Id).IsUnique(false);
            });

            // Configurazione per l'inventario
            modelBuilder.Entity<CardInventory>(entity =>
            {
                entity.HasIndex(i => new { i.UserId, i.CardId, i.CardType }).IsUnique();

                entity.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(i => i.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configurazione CardMarket Prices
            modelBuilder.Entity<PokemonCardMarketPrices>(entity =>
            {
                entity.HasKey(p => new { p.PokemonCardId, p.UpdatedAt });

                // Rimuovo eventuali indici univoci non necessari
                entity.HasIndex(p => p.PokemonCardId).IsUnique(false);
            });

            modelBuilder.Entity<PokemonCardMarketPriceDetails>(entity =>
            {
                entity.HasKey(p => new { p.PokemonCardId, p.UpdatedAt });

                entity.HasOne(d => d.PokemonCardMarketPrices)
                    .WithMany(p => p.PriceDetails)
                    .HasForeignKey(d => new { d.PokemonCardId, d.UpdatedAt })
                    .OnDelete(DeleteBehavior.Cascade);

                // Rimuovo eventuali indici univoci non necessari
                entity.HasIndex(p => p.PokemonCardId).IsUnique(false);
            });

            // Configurazione TCGPlayer Prices
            modelBuilder.Entity<PokemonTcgPlayerPrices>(entity =>
            {
                entity.HasKey(p => new { p.PokemonCardId, p.UpdatedAt });

                // Rimuovo eventuali indici univoci non necessari
                entity.HasIndex(p => p.PokemonCardId).IsUnique(false);
            });

            modelBuilder.Entity<PokemonTcgPlayerPriceDetails>(entity =>
            {
                entity.HasKey(p => new { p.PokemonCardId, p.UpdatedAt, p.FoilType });

                entity.HasOne(d => d.PokemonTcgPlayerPrices)
                    .WithMany(p => p.PriceDetails)
                    .HasForeignKey(d => new { d.PokemonCardId, d.UpdatedAt })
                    .OnDelete(DeleteBehavior.Cascade);

                // Rimuovo eventuali indici univoci non necessari
                entity.HasIndex(p => p.PokemonCardId).IsUnique(false);
            });
        }
    }
}