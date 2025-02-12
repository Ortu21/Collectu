using System.Text.Json.Serialization;

namespace CardCollectionAPI.Models.Dtos;

    public partial class Pokemon
{
    [JsonPropertyName("data")]
    public required Data Data { get; set; }
}

public partial class Data
{
    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("name")]
    public required string Name { get; set; }

    [JsonPropertyName("supertype")]
    public required string Supertype { get; set; }

    [JsonPropertyName("subtypes")]
    public required List<string> Subtypes { get; set; }

    [JsonPropertyName("hp")]
    public long Hp { get; set; }

    [JsonPropertyName("types")]
    public required List<string> Types { get; set; }

    [JsonPropertyName("evolvesFrom")]
    public required string EvolvesFrom { get; set; }

    [JsonPropertyName("attacks")]
    public required List<Attack> Attacks { get; set; }

    [JsonPropertyName("weaknesses")]
    public required List<Resistance> Weaknesses { get; set; }

    [JsonPropertyName("resistances")]
    public required List<Resistance> Resistances { get; set; }

    [JsonPropertyName("retreatCost")]
    public required List<string> RetreatCost { get; set; }

    [JsonPropertyName("convertedRetreatCost")]
    public long ConvertedRetreatCost { get; set; }

    [JsonPropertyName("set")]
    public required Set Set { get; set; }

    [JsonPropertyName("number")]
    public long Number { get; set; }

    [JsonPropertyName("artist")]
    public required string Artist { get; set; }

    [JsonPropertyName("rarity")]
    public required string Rarity { get; set; }

    [JsonPropertyName("flavorText")]
    public required string FlavorText { get; set; }

    [JsonPropertyName("nationalPokedexNumbers")]
    public required List<long> NationalPokedexNumbers { get; set; }

    [JsonPropertyName("legalities")]
    public required Legalities Legalities { get; set; }

    [JsonPropertyName("images")]
    public required DataImages Images { get; set; }

    [JsonPropertyName("tcgplayer")]
    public required Tcgplayer Tcgplayer { get; set; }

    [JsonPropertyName("cardmarket")]
    public required Cardmarket Cardmarket { get; set; }
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
    public long Damage { get; set; }

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
    public required Dictionary<string, double> Prices { get; set; }
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
    public required string PtcgoCode { get; set; }

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
    public required Prices Prices { get; set; }
}

public partial class Prices
{
    [JsonPropertyName("holofoil")]
    public required Holofoil Holofoil { get; set; }

    [JsonPropertyName("reverseHolofoil")]
    public required Holofoil ReverseHolofoil { get; set; }
}

public partial class Holofoil
{
    [JsonPropertyName("low")]
    public double Low { get; set; }

    [JsonPropertyName("mid")]
    public double Mid { get; set; }

    [JsonPropertyName("high")]
    public double High { get; set; }

    [JsonPropertyName("market")]
    public double Market { get; set; }

    [JsonPropertyName("directLow")]
    public required object DirectLow { get; set; }
}