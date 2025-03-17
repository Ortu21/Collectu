using CardCollectionAPI.Data;
using CardCollectionAPI.Models;
using CardCollectionAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace CardCollectionAPI.Services
{
    public class PokemonSetService(AppDbContext dbContext)
    {
        private readonly AppDbContext _dbContext = dbContext;
        public async Task<PokemonSet> GetOrCreateSetAsync(Set setDto)
        {
            // Verifica se setDto è null
            if (setDto == null)
            {
                throw new ArgumentNullException(nameof(setDto), "Il set non può essere null");
            }
            // Verifica se il nome del set è valido
            if (string.IsNullOrWhiteSpace(setDto.Name))
            {
                throw new ArgumentException("Il nome del set non può essere vuoto", nameof(setDto));
            }
            var existingSet = await _dbContext.PokemonSets
                .FirstOrDefaultAsync(s => s.SetName == setDto.Name);

            if (existingSet == null)
            {
                // Verifica che tutti i campi necessari siano presenti
                if (string.IsNullOrWhiteSpace(setDto.Id))
                {
                    throw new ArgumentException("L'ID del set non può essere vuoto", nameof(setDto));
                }

                if (string.IsNullOrWhiteSpace(setDto.Series))
                {
                    // Usa un valore di default se la serie è null o vuota
                    setDto.Series = "Unknown Series";
                }

                if (string.IsNullOrWhiteSpace(setDto.ReleaseDate))
                {
                    // Usa la data corrente se la data di rilascio è null o vuota
                    setDto.ReleaseDate = DateTime.Now.ToString("yyyy-MM-dd");
                }

                // Verifica che Images e Logo non siano null
                string logoUrl = setDto.Images?.Logo?.ToString() ?? "";

                existingSet = new PokemonSet
                {
                    SetId = setDto.Id,
                    SetName = setDto.Name,
                    Series = setDto.Series,
                    ReleaseDate = DateOnly.TryParse(setDto.ReleaseDate, out var releaseDate)
                        ? releaseDate
                        : DateOnly.FromDateTime(DateTime.Now),
                    LogoUrl = logoUrl,
                };

                _dbContext.PokemonSets.Add(existingSet);
                await _dbContext.SaveChangesAsync();
            }

            return existingSet;
        }
    }
}
