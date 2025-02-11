using System.Text.Json.Serialization;

namespace CardCollectionAPI.Models
{
    public class PokemonApiResponse
    {
        [JsonPropertyName("data")]
        public List<PokemonCard>? Data { get; set; }
    }
}