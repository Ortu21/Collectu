using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class modificaRelazioneCardMarket2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails",
                columns: new[] { "PokemonCardId", "UpdatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails",
                column: "PokemonCardId");
        }
    }
}
