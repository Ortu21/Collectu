using System.Text.Json.Serialization;

namespace CardCollectionAPI.Models.Dtos
{
    public class PokemonCardDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Supertype { get; set; }
        public required string Hp { get; set; }
        public required string EvolvesFrom { get; set; }
        public required string Rarity { get; set; }
        public required PokemonSetDto Set { get; set; }
        public required PokemonImageDto Images { get; set; }
        public required List<PokemonAttackDto> Attacks { get; set; }
        public required List<PokemonWeaknessDto> Weaknesses { get; set; }
        public required List<PokemonResistanceDto> Resistances { get; set; }
        public required PokemonTcgPlayerDto Tcgplayer { get; set; }
        public required PokemonCardMarketDto Cardmarket { get; set; }
    }

    public class PokemonSetDto
    {
        public required string Name { get; set; }
        public required string Series { get; set; }
        public required string ReleaseDate { get; set; }
        public required PokemonSetImageDto Images { get; set; }
    }

    public class PokemonSetImageDto
    {
        public required string Logo { get; set; }
    }

    public class PokemonImageDto
    {
        public required string Small { get; set; }
        public required string Large { get; set; }
    }

    public class PokemonAttackDto
    {
        public required string Name { get; set; }
        public required string Damage { get; set; }
        public required string Text { get; set; }
        public required List<string> Cost { get; set; }
        public int ConvertedEnergyCost { get; set; }
    }

    public class PokemonWeaknessDto
    {
        public required string Type { get; set; }
        public required string Value { get; set; }
    }

    public class PokemonResistanceDto
    {
        public required string Type { get; set; }
        public required string Value { get; set; }
    }

    public class PokemonTcgPlayerDto
    {
        public required PokemonTcgPlayerPriceDto Prices { get; set; }
    }

    public class PokemonTcgPlayerPriceDto
    {
        public required PokemonPriceDetailsDto Holofoil { get; set; }
        public required PokemonPriceDetailsDto ReverseHolofoil { get; set; }
    }

    public class PokemonPriceDetailsDto
    {
        public decimal? Low { get; set; }
        public decimal? Mid { get; set; }
        public decimal? High { get; set; }
        public decimal? Market { get; set; }
    }

    public class PokemonCardMarketDto
    {
        public PokemonCardMarketPriceDto? Prices { get; set; }
    }

    public class PokemonCardMarketPriceDto
    {
        public decimal? LowPrice { get; set; }
        public decimal? TrendPrice { get; set; }
        public decimal? ReverseHoloTrend { get; set; }
    }
}
