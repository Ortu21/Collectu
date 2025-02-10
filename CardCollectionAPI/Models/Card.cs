//Tabella carte pokemon
namespace CardCollectionAPI.Models
{
    public class Card
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Set { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string Rarity { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsHolo { get; set; }
        public string Condition { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }
    }
}
