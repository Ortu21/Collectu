using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class PuliziaEAggiornamentoPriceDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Pulisci i dati esistenti prima di applicare le modifiche strutturali
            migrationBuilder.Sql(@"DELETE FROM ""PokemonCardMarketPriceDetails""");
            migrationBuilder.Sql(@"DELETE FROM ""PokemonCardTcgPriceDetails""");
            
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCardMarketPriceDetails_PokemonCardMarketPrices_Pokem~",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCardTcgPriceDetails_PokemonCardTcgPrices_PokemonTcgP~",
                table: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardTcgPrices",
                table: "PokemonCardTcgPrices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardTcgPriceDetails",
                table: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropIndex(
                name: "IX_PokemonCardTcgPriceDetails_PokemonTcgPlayerPricesId",
                table: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardMarketPrices",
                table: "PokemonCardMarketPrices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropIndex(
                name: "IX_PokemonCardMarketPriceDetails_PokemonCardMarketPricesId",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PokemonCardTcgPrices");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropColumn(
                name: "PokemonTcgPlayerPricesId",
                table: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PokemonCardMarketPrices");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropColumn(
                name: "PokemonCardMarketPricesId",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.AddColumn<string>(
                name: "PokemonCardId",
                table: "PokemonCardTcgPriceDetails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateOnly>(
                name: "UpdatedAt",
                table: "PokemonCardTcgPriceDetails",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "PokemonCardId",
                table: "PokemonCardMarketPriceDetails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateOnly>(
                name: "UpdatedAt",
                table: "PokemonCardMarketPriceDetails",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardTcgPrices",
                table: "PokemonCardTcgPrices",
                columns: new[] { "PokemonCardId", "UpdatedAt" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardTcgPriceDetails",
                table: "PokemonCardTcgPriceDetails",
                columns: new[] { "PokemonCardId", "UpdatedAt", "FoilType" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPrices",
                table: "PokemonCardMarketPrices",
                columns: new[] { "PokemonCardId", "UpdatedAt" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails",
                columns: new[] { "PokemonCardId", "UpdatedAt" });

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardMarketPriceDetails_PokemonCardMarketPrices_Pokem~",
                table: "PokemonCardMarketPriceDetails",
                columns: new[] { "PokemonCardId", "UpdatedAt" },
                principalTable: "PokemonCardMarketPrices",
                principalColumns: new[] { "PokemonCardId", "UpdatedAt" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardTcgPriceDetails_PokemonCardTcgPrices_PokemonCard~",
                table: "PokemonCardTcgPriceDetails",
                columns: new[] { "PokemonCardId", "UpdatedAt" },
                principalTable: "PokemonCardTcgPrices",
                principalColumns: new[] { "PokemonCardId", "UpdatedAt" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCardMarketPriceDetails_PokemonCardMarketPrices_Pokem~",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCardTcgPriceDetails_PokemonCardTcgPrices_PokemonCard~",
                table: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardTcgPrices",
                table: "PokemonCardTcgPrices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardTcgPriceDetails",
                table: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardMarketPrices",
                table: "PokemonCardMarketPrices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropColumn(
                name: "PokemonCardId",
                table: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropColumn(
                name: "PokemonCardId",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "PokemonCardMarketPriceDetails");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "PokemonCardTcgPrices",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "PokemonCardTcgPriceDetails",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "PokemonTcgPlayerPricesId",
                table: "PokemonCardTcgPriceDetails",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "PokemonCardMarketPrices",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "PokemonCardMarketPriceDetails",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "PokemonCardMarketPricesId",
                table: "PokemonCardMarketPriceDetails",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardTcgPrices",
                table: "PokemonCardTcgPrices",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardTcgPriceDetails",
                table: "PokemonCardTcgPriceDetails",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPrices",
                table: "PokemonCardMarketPrices",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCardMarketPriceDetails",
                table: "PokemonCardMarketPriceDetails",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardTcgPriceDetails_PokemonTcgPlayerPricesId",
                table: "PokemonCardTcgPriceDetails",
                column: "PokemonTcgPlayerPricesId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardMarketPriceDetails_PokemonCardMarketPricesId",
                table: "PokemonCardMarketPriceDetails",
                column: "PokemonCardMarketPricesId");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardMarketPriceDetails_PokemonCardMarketPrices_Pokem~",
                table: "PokemonCardMarketPriceDetails",
                column: "PokemonCardMarketPricesId",
                principalTable: "PokemonCardMarketPrices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardTcgPriceDetails_PokemonCardTcgPrices_PokemonTcgP~",
                table: "PokemonCardTcgPriceDetails",
                column: "PokemonTcgPlayerPricesId",
                principalTable: "PokemonCardTcgPrices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
