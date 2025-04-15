namespace CardCollectionAPI.Models.DTO
{
    public class AddToInventoryDto
    {
        public required int UserId { get; set; }
        public required string CardId { get; set; }
        public required string CardType { get; set; }
        public int Quantity { get; set; }
        public string? Condition { get; set; }
    }

    public class CardInventoryResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string CardId { get; set; } = string.Empty;
        public string CardType { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? Condition { get; set; }
    }
} 