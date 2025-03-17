using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PokemonSets",
                columns: table => new
                {
                    SetId = table.Column<string>(type: "text", nullable: false),
                    SetName = table.Column<string>(type: "text", nullable: false),
                    Series = table.Column<string>(type: "text", nullable: false),
                    ReleaseDate = table.Column<DateOnly>(type: "date", nullable: false),
                    LogoUrl = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonSets", x => x.SetId);
                });

            migrationBuilder.CreateTable(
                name: "PokemonCards",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Supertype = table.Column<string>(type: "text", nullable: false),
                    Hp = table.Column<string>(type: "text", nullable: true),
                    EvolvesFrom = table.Column<string>(type: "text", nullable: false),
                    Rarity = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    SetId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonCards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PokemonCards_PokemonSets_SetId",
                        column: x => x.SetId,
                        principalTable: "PokemonSets",
                        principalColumn: "SetId");
                });

            migrationBuilder.CreateTable(
                name: "PokemonAttacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Damage = table.Column<string>(type: "text", nullable: true),
                    Text = table.Column<string>(type: "text", nullable: false),
                    Cost = table.Column<string>(type: "text", nullable: false),
                    ConvertedEnergyCost = table.Column<string>(type: "text", nullable: false),
                    PokemonCardId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonAttacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PokemonAttacks_PokemonCards_PokemonCardId",
                        column: x => x.PokemonCardId,
                        principalTable: "PokemonCards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PokemonCardMarketPrices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PokemonCardId = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateOnly>(type: "date", nullable: false)
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
                    UpdatedAt = table.Column<DateOnly>(type: "date", nullable: false)
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
                name: "PokemonResistances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    PokemonCardId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonResistances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PokemonResistances_PokemonCards_PokemonCardId",
                        column: x => x.PokemonCardId,
                        principalTable: "PokemonCards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PokemonWeaknesses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    PokemonCardId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonWeaknesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PokemonWeaknesses_PokemonCards_PokemonCardId",
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
                name: "IX_PokemonAttacks_PokemonCardId",
                table: "PokemonAttacks",
                column: "PokemonCardId");

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
                name: "IX_PokemonCards_SetId",
                table: "PokemonCards",
                column: "SetId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardTcgPriceDetails_PokemonTcgPlayerPricesId",
                table: "PokemonCardTcgPriceDetails",
                column: "PokemonTcgPlayerPricesId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCardTcgPrices_PokemonCardId",
                table: "PokemonCardTcgPrices",
                column: "PokemonCardId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PokemonResistances_PokemonCardId",
                table: "PokemonResistances",
                column: "PokemonCardId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonWeaknesses_PokemonCardId",
                table: "PokemonWeaknesses",
                column: "PokemonCardId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PokemonAttacks");

            migrationBuilder.DropTable(
                name: "PokemonCardMarketPriceDetails");

            migrationBuilder.DropTable(
                name: "PokemonCardTcgPriceDetails");

            migrationBuilder.DropTable(
                name: "PokemonResistances");

            migrationBuilder.DropTable(
                name: "PokemonWeaknesses");

            migrationBuilder.DropTable(
                name: "PokemonCardMarketPrices");

            migrationBuilder.DropTable(
                name: "PokemonCardTcgPrices");

            migrationBuilder.DropTable(
                name: "PokemonCards");

            migrationBuilder.DropTable(
                name: "PokemonSets");
        }
    }
}
