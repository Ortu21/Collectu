using Microsoft.EntityFrameworkCore;
using CardCollectionAPI.Models;

namespace CardCollectionAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Card> Cards { get; set; }
    }
}
