using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class CorrezionePrezziCardMarket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "pokemoncardmarketpricedetails_pokemoncardmarketprices_fk",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardMarketPrices",
                table: "PokemonCardMarketPrices");

            migrationBuilder.AddColumn<DateOnly>(
                name: "UpdatedAt",
                table: "PokemonCardMarketPrices",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPrices",
                table: "PokemonCardMarketPrices",
                columns: new[] { "PokemonCardId", "UpdatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardMarketPrices_PokemonCardId",
                table: "PokemonCardMarketPrices",
                column: "PokemonCardId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardMarketPriceDetails_PokemonCardMarketPrices_Pokem~",
                table: "PokemonCardMarketPriceDetails",
                columns: new[] { "PokemonCardId", "UpdatedAt" },
                principalTable: "PokemonCardMarketPrices",
                principalColumns: new[] { "PokemonCardId", "UpdatedAt" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCardMarketPriceDetails_PokemonCardMarketPrices_Pokem~",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardMarketPrices",
                table: "PokemonCardMarketPrices");

            migrationBuilder.DropIndex(
                name: "IX_PokemonCardMarketPrices_PokemonCardId",
                table: "PokemonCardMarketPrices");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "PokemonCardMarketPrices");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPrices",
                table: "PokemonCardMarketPrices",
                column: "PokemonCardId");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardMarketPriceDetails_PokemonCardMarketPrices_Pokem~",
                table: "PokemonCardMarketPriceDetails",
                column: "PokemonCardId",
                principalTable: "PokemonCardMarketPrices",
                principalColumn: "PokemonCardId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
