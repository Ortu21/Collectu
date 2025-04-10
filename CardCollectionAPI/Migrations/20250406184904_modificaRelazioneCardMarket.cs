using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class modificaRelazioneCardMarket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "PokemonCardMarketPrices");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPrices",
                table: "PokemonCardMarketPrices",
                column: "PokemonCardId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails",
                column: "PokemonCardId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardMarketPriceDetails_PokemonCardId",
                table: "PokemonCardMarketPriceDetails",
                column: "PokemonCardId");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardMarketPriceDetails_PokemonCardMarketPrices_Pokem~",
                table: "PokemonCardMarketPriceDetails",
                column: "PokemonCardId",
                principalTable: "PokemonCardMarketPrices",
                principalColumn: "PokemonCardId",
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

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropIndex(
                name: "IX_PokemonCardMarketPriceDetails_PokemonCardId",
                table: "PokemonCardMarketPriceDetails");

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

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails",
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
    }
}
