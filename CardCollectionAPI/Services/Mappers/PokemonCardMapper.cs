using CardCollectionAPI.Models;
using CardCollectionAPI.Models.Dtos;

namespace CardCollectionAPI.Services.Mappers
{
    public static class PokemonCardMapper
    {
        public static PokemonCard MapDtoToEntity(PokemonCardDto dto)
        {
            var card = new PokemonCard
            {
                Id = dto.Id,
                Name = dto.Name,
                Supertype = dto.Supertype ?? string.Empty,
                Hp = dto.Hp,
                EvolvesFrom = dto.EvolvesFrom ?? string.Empty,
                Rarity = dto.Rarity ?? string.Empty,
                ImageUrl = dto.Images.Large.ToString(),
                SetId = dto.Set.Id
            };

            card.Attacks = dto.Attacks?.Select(a => new PokemonAttack
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,
                Name = a.Name,
                Damage = a.Damage,
                Text = a.Text,
                Cost = string.Join(", ", a.Cost),
                ConvertedEnergyCost = a.ConvertedEnergyCost.ToString(),
            }).ToList() ?? [];

            card.Weaknesses = dto.Weaknesses?.Select(w => new PokemonWeakness
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,
                Type = w.Type,
                Value = w.Value,
            }).ToList() ?? [];

            card.Resistances = dto.Resistances?.Select(r => new PokemonResistance
            {
                PokemonCardId = dto.Id,
                PokemonCard = card,
                Type = r.Type,
                Value = r.Value,
            }).ToList() ?? [];

            return card;
        }
    }
}
