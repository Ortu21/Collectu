namespace CardCollectionAPI.Services.Interfaces
{
    public interface IPokemonPriceService
    {
        /// <summary>
        /// Aggiorna i prezzi di tutte le carte Pokémon esistenti nel database
        /// </summary>
        Task UpdateCardPricesAsync();

        /// <summary>
        /// Aggiorna i prezzi di una singola carta Pokémon
        /// </summary>
        /// <param name="cardId">ID della carta da aggiornare</param>
        Task UpdateSingleCardPriceAsync(string cardId);
    }
}