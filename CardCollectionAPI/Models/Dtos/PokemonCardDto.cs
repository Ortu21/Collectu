using System.Text.Json.Serialization;

namespace CardCollectionAPI.Models.Dtos;

public partial class PokemonCardDto
{
    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("name")]
    public required string Name { get; set; }

    [JsonPropertyName("supertype")]
    public string? Supertype { get; set; }

    [JsonPropertyName("subtypes")]
    public List<string>? Subtypes { get; set; }

    [JsonPropertyName("hp")]
    public string? Hp { get; set; }

    [JsonPropertyName("types")]
    public List<string>? Types { get; set; }

    [JsonPropertyName("evolvesFrom")]
    public string? EvolvesFrom { get; set; }

    [JsonPropertyName("attacks")]
    public List<Attack>? Attacks { get; set; }

    [JsonPropertyName("weaknesses")]
    public List<Resistance>? Weaknesses { get; set; }

    [JsonPropertyName("resistances")]
    public List<Resistance>? Resistances { get; set; }

    [JsonPropertyName("retreatCost")]
    public List<string>? RetreatCost { get; set; }

    [JsonPropertyName("convertedRetreatCost")]
    public long ConvertedRetreatCost { get; set; }

    [JsonPropertyName("set")]
    public required Set Set { get; set; }

    [JsonPropertyName("number")]
    public string? Number { get; set; }

    [JsonPropertyName("artist")]
    public string? Artist { get; set; }

    [JsonPropertyName("rarity")]
    public string? Rarity { get; set; }

    [JsonPropertyName("flavorText")]
    public string? FlavorText { get; set; }

    [JsonPropertyName("nationalPokedexNumbers")]
    public List<long>? NationalPokedexNumbers { get; set; }

    [JsonPropertyName("legalities")]
    public required Legalities Legalities { get; set; }

    [JsonPropertyName("images")]
    public required DataImages Images { get; set; }

    [JsonPropertyName("tcgplayer")]
    public Tcgplayer? Tcgplayer { get; set; }

    [JsonPropertyName("cardmarket")]
    public Cardmarket? Cardmarket { get; set; }
}

public partial class Attack
{
    [JsonPropertyName("name")]
    public required string Name { get; set; }

    [JsonPropertyName("cost")]
    public required List<string> Cost { get; set; }

    [JsonPropertyName("convertedEnergyCost")]
    public long ConvertedEnergyCost { get; set; }

    [JsonPropertyName("damage")]
    public string? Damage { get; set; }

    [JsonPropertyName("text")]
    public required string Text { get; set; }
}

public partial class Cardmarket
{
    [JsonPropertyName("url")]
    public required Uri Url { get; set; }

    [JsonPropertyName("updatedAt")]
    public required string UpdatedAt { get; set; }

    [JsonPropertyName("prices")]
    public CardmarketPrices? CardmarketPrices { get; set; }
}

public class CardmarketPrices
{
    [JsonPropertyName("averageSellPrice")]
    public decimal? AverageSellPrice { get; set; }

    [JsonPropertyName("lowPrice")]
    public decimal? LowPrice { get; set; }

    [JsonPropertyName("trendPrice")]
    public decimal? TrendPrice { get; set; }

    [JsonPropertyName("germanProLow")]
    public decimal? GermanProLow { get; set; }

    [JsonPropertyName("suggestedPrice")]
    public decimal? SuggestedPrice { get; set; }

    [JsonPropertyName("reverseHoloSell")]
    public decimal? ReverseHoloSell { get; set; }

    [JsonPropertyName("reverseHoloLow")]
    public decimal? ReverseHoloLow { get; set; }

    [JsonPropertyName("reverseHoloTrend")]
    public decimal? ReverseHoloTrend { get; set; }

    [JsonPropertyName("lowPriceExPlus")]
    public decimal? LowPriceExPlus { get; set; }

    [JsonPropertyName("avg1")]
    public decimal? Avg1 { get; set; }

    [JsonPropertyName("avg7")]
    public decimal? Avg7 { get; set; }

    [JsonPropertyName("avg30")]
    public decimal? Avg30 { get; set; }

    [JsonPropertyName("reverseHoloAvg1")]
    public decimal? ReverseHoloAvg1 { get; set; }

    [JsonPropertyName("reverseHoloAvg7")]
    public decimal? ReverseHoloAvg7 { get; set; }

    [JsonPropertyName("reverseHoloAvg30")]
    public decimal? ReverseHoloAvg30 { get; set; }
}

public partial class DataImages
{
    [JsonPropertyName("small")]
    public required Uri Small { get; set; }

    [JsonPropertyName("large")]
    public required Uri Large { get; set; }
}

public partial class Legalities
{
    [JsonPropertyName("unlimited")]
    public required string Unlimited { get; set; }
}

public partial class Resistance
{
    [JsonPropertyName("type")]
    public required string Type { get; set; }

    [JsonPropertyName("value")]
    public required string Value { get; set; }
}

public partial class Set
{
    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("name")]
    public required string Name { get; set; }

    [JsonPropertyName("series")]
    public required string Series { get; set; }

    [JsonPropertyName("printedTotal")]
    public long PrintedTotal { get; set; }

    [JsonPropertyName("total")]
    public long Total { get; set; }

    [JsonPropertyName("legalities")]
    public required Legalities Legalities { get; set; }

    [JsonPropertyName("ptcgoCode")]
    public string? PtcgoCode { get; set; }

    [JsonPropertyName("releaseDate")]
    public required string ReleaseDate { get; set; }

    [JsonPropertyName("updatedAt")]
    public required string UpdatedAt { get; set; }

    [JsonPropertyName("images")]
    public required SetImages Images { get; set; }
}

public partial class SetImages
{
    [JsonPropertyName("symbol")]
    public required Uri Symbol { get; set; }

    [JsonPropertyName("logo")]
    public required Uri Logo { get; set; }
}

public partial class Tcgplayer
{
    [JsonPropertyName("url")]
    public required Uri Url { get; set; }

    [JsonPropertyName("updatedAt")]
    public required string UpdatedAt { get; set; }

    [JsonPropertyName("prices")]
    public  TcgplayerPrices? TcgplayerPrices { get; set; }
}

public partial class TcgplayerPrices
{
    [JsonPropertyName("holofoil")]
    public Holofoil? Holofoil { get; set; }

    [JsonPropertyName("reverseHolofoil")]
    public ReverseHolofoil? ReverseHolofoil { get; set; }

    [JsonPropertyName("normal")]
    public Normal? Normal { get; set; }

    [JsonPropertyName("1stEditionHolofoil")]
    public The1stEditionHolofoil? The1stEditionHolofoil { get; set; }
}

public partial class Holofoil
{
    [JsonPropertyName("low")]
    public decimal? Low { get; set; }

    [JsonPropertyName("mid")]
    public decimal? Mid { get; set; }

    [JsonPropertyName("high")]
    public decimal? High { get; set; }

    [JsonPropertyName("market")]
    public decimal? Market { get; set; }

    [JsonPropertyName("directLow")]
    public decimal? DirectLow { get; set; }
}

public class ReverseHolofoil
{
    [JsonPropertyName("low")]
    public decimal? Low { get; set; }

    [JsonPropertyName("mid")]
    public decimal? Mid { get; set; }

    [JsonPropertyName("high")]
    public decimal? High { get; set; }

    [JsonPropertyName("market")]
    public decimal? Market { get; set; }

    [JsonPropertyName("directLow")]
    public decimal? DirectLow { get; set; } 
}

public partial class Normal
{
    [JsonPropertyName("low")]
    public decimal? Low { get; set; }

    [JsonPropertyName("mid")]
    public decimal? Mid { get; set; }

    [JsonPropertyName("high")]
    public decimal? High { get; set; }

    [JsonPropertyName("market")]
    public decimal? Market { get; set; }

    [JsonPropertyName("directLow")]
    public decimal? DirectLow { get; set; }
}

public partial class The1stEditionHolofoil
{
    [JsonPropertyName("low")]
    public decimal? Low { get; set; }

    [JsonPropertyName("mid")]
    public decimal? Mid { get; set; }

    [JsonPropertyName("high")]
    public decimal? High { get; set; }

    [JsonPropertyName("market")]
    public decimal? Market { get; set; }

    [JsonPropertyName("directLow")]
    public decimal? DirectLow { get; set; }
}