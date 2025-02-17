using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class UltimeModificheAlleTabelle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PokemonPrices");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ReleaseDate",
                table: "PokemonSets",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Hp",
                table: "PokemonCards",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Damage",
                table: "PokemonAttacks",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "PokemonCardMarketPrices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PokemonCardId = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonCardMarketPrices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PokemonCardMarketPrices_PokemonCards_PokemonCardId",
                        column: x => x.PokemonCardId,
                        principalTable: "PokemonCards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PokemonCardTcgPrices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PokemonCardId = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonCardTcgPrices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PokemonCardTcgPrices_PokemonCards_PokemonCardId",
                        column: x => x.PokemonCardId,
                        principalTable: "PokemonCards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PokemonCardMarketPriceDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PokemonCardMarketPricesId = table.Column<int>(type: "integer", nullable: false),
                    AverageSellPrice = table.Column<decimal>(type: "numeric", nullable: true),
                    LowPrice = table.Column<decimal>(type: "numeric", nullable: true),
                    TrendPrice = table.Column<decimal>(type: "numeric", nullable: true),
                    GermanProLow = table.Column<decimal>(type: "numeric", nullable: true),
                    SuggestedPrice = table.Column<decimal>(type: "numeric", nullable: true),
                    ReverseHoloSell = table.Column<decimal>(type: "numeric", nullable: true),
                    ReverseHoloLow = table.Column<decimal>(type: "numeric", nullable: true),
                    ReverseHoloTrend = table.Column<decimal>(type: "numeric", nullable: true),
                    LowPriceExPlus = table.Column<decimal>(type: "numeric", nullable: true),
                    Avg1 = table.Column<decimal>(type: "numeric", nullable: true),
                    Avg7 = table.Column<decimal>(type: "numeric", nullable: true),
                    Avg30 = table.Column<decimal>(type: "numeric", nullable: true),
                    ReverseHoloAvg1 = table.Column<decimal>(type: "numeric", nullable: true),
                    ReverseHoloAvg7 = table.Column<decimal>(type: "numeric", nullable: true),
                    ReverseHoloAvg30 = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonCardMarketPriceDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PokemonCardMarketPriceDetails_PokemonCardMarketPrices_Pokem~",
                        column: x => x.PokemonCardMarketPricesId,
                        principalTable: "PokemonCardMarketPrices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PokemonCardTcgPriceDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PokemonTcgPlayerPricesId = table.Column<int>(type: "integer", nullable: false),
                    FoilType = table.Column<string>(type: "text", nullable: false),
                    Low = table.Column<decimal>(type: "numeric", nullable: true),
                    Mid = table.Column<decimal>(type: "numeric", nullable: true),
                    High = table.Column<decimal>(type: "numeric", nullable: true),
                    Market = table.Column<decimal>(type: "numeric", nullable: true),
                    DirectLow = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonCardTcgPriceDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PokemonCardTcgPriceDetails_PokemonCardTcgPrices_PokemonTcgP~",
                        column: x => x.PokemonTcgPlayerPricesId,
                        principalTable: "PokemonCardTcgPrices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardMarketPriceDetails_PokemonCardMarketPricesId",
                table: "PokemonCardMarketPriceDetails",
                column: "PokemonCardMarketPricesId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardMarketPrices_PokemonCardId",
                table: "PokemonCardMarketPrices",
                column: "PokemonCardId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardTcgPriceDetails_PokemonTcgPlayerPricesId",
                table: "PokemonCardTcgPriceDetails",
                column: "PokemonTcgPlayerPricesId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardTcgPrices_PokemonCardId",
                table: "PokemonCardTcgPrices",
                column: "PokemonCardId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropTable(
                name: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropTable(
                name: "PokemonCardMarketPrices");

            migrationBuilder.DropTable(
                name: "PokemonCardTcgPrices");

            migrationBuilder.AlterColumn<string>(
                name: "ReleaseDate",
                table: "PokemonSets",
                type: "text",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "Hp",
                table: "PokemonCards",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Damage",
                table: "PokemonAttacks",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "PokemonPrices",
                columns: table => new
                {
                    PokemonCardId = table.Column<string>(type: "text", nullable: false),
                    CardmarketLow = table.Column<decimal>(type: "numeric", nullable: true),
                    CardmarketReverseHolo = table.Column<decimal>(type: "numeric", nullable: true),
                    CardmarketTrend = table.Column<decimal>(type: "numeric", nullable: true),
                    TcgHigh = table.Column<decimal>(type: "numeric", nullable: true),
                    TcgLow = table.Column<decimal>(type: "numeric", nullable: true),
                    TcgMarket = table.Column<decimal>(type: "numeric", nullable: true),
                    TcgMid = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonPrices", x => x.PokemonCardId);
                    table.ForeignKey(
                        name: "FK_PokemonPrices_PokemonCards_PokemonCardId",
                        column: x => x.PokemonCardId,
                        principalTable: "PokemonCards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }
    }
}
