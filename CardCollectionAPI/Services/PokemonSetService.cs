using CardCollectionAPI.Data;
using CardCollectionAPI.Models;
using CardCollectionAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Services
{
    public class PokemonSetService(AppDbContext dbContext)
    {
        private readonly AppDbContext _dbContext = dbContext;

        public async Task<PokemonSet> GetOrCreateSetAsync(Set setDto)
        {
            var existingSet = await _dbContext.PokemonSets
                .FirstOrDefaultAsync(s => s.SetName == (setDto != null ? setDto.Name : string.Empty));

            if (existingSet == null)
            {
                existingSet = new PokemonSet
                {   
                    SetId = setDto.Id,
                    SetName = setDto.Name,
                    Series = setDto.Series,
                    ReleaseDate = DateOnly.Parse(setDto.ReleaseDate),
                    LogoUrl = setDto.Images.Logo.ToString(),
                };

                _dbContext.PokemonSets.Add(existingSet);
                await _dbContext.SaveChangesAsync();
            }

            return existingSet;
        }
    }
}
