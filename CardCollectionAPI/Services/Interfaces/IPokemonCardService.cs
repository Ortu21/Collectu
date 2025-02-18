using CardCollectionAPI.Models.Dtos;

namespace CardCollectionAPI.Services.Interfaces
{
    public interface IPokemonCardService
    {
        Task ImportPokemonCardsAsync();
        Task ImportSingleCardAsync(string cardId);
    }
}
