using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixPriceTablesIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PokemonCardTcgPrices_PokemonCardId",
                table: "PokemonCardTcgPrices");

            migrationBuilder.DropIndex(
                name: "IX_PokemonCardMarketPrices_PokemonCardId",
                table: "PokemonCardMarketPrices");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardTcgPrices_PokemonCardId",
                table: "PokemonCardTcgPrices",
                column: "PokemonCardId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardTcgPriceDetails_PokemonCardId",
                table: "PokemonCardTcgPriceDetails",
                column: "PokemonCardId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardMarketPrices_PokemonCardId",
                table: "PokemonCardMarketPrices",
                column: "PokemonCardId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PokemonCardTcgPrices_PokemonCardId",
                table: "PokemonCardTcgPrices");

            migrationBuilder.DropIndex(
                name: "IX_PokemonCardTcgPriceDetails_PokemonCardId",
                table: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropIndex(
                name: "IX_PokemonCardMarketPrices_PokemonCardId",
                table: "PokemonCardMarketPrices");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardTcgPrices_PokemonCardId",
                table: "PokemonCardTcgPrices",
                column: "PokemonCardId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardMarketPrices_PokemonCardId",
                table: "PokemonCardMarketPrices",
                column: "PokemonCardId",
                unique: true);
        }
    }
}
