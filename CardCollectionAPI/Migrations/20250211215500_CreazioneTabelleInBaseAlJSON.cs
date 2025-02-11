using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class CreazioneTabelleInBaseAlJSON : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceHigh",
                table: "PokemonCards");

            migrationBuilder.DropColumn(
                name: "PriceLow",
                table: "PokemonCards");

            migrationBuilder.DropColumn(
                name: "PriceMid",
                table: "PokemonCards");

            migrationBuilder.RenameColumn(
                name: "SetName",
                table: "PokemonCards",
                newName: "Supertype");

            migrationBuilder.AddColumn<string>(
                name: "EvolvesFrom",
                table: "PokemonCards",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Hp",
                table: "PokemonCards",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SetId",
                table: "PokemonCards",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "PokemonAttacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Damage = table.Column<string>(type: "text", nullable: false),
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
                name: "PokemonPrices",
                columns: table => new
                {
                    PokemonCardId = table.Column<string>(type: "text", nullable: false),
                    TcgLow = table.Column<decimal>(type: "numeric", nullable: true),
                    TcgMid = table.Column<decimal>(type: "numeric", nullable: true),
                    TcgHigh = table.Column<decimal>(type: "numeric", nullable: true),
                    TcgMarket = table.Column<decimal>(type: "numeric", nullable: true),
                    CardmarketLow = table.Column<decimal>(type: "numeric", nullable: true),
                    CardmarketTrend = table.Column<decimal>(type: "numeric", nullable: true),
                    CardmarketReverseHolo = table.Column<decimal>(type: "numeric", nullable: true)
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
                name: "PokemonSets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SetName = table.Column<string>(type: "text", nullable: false),
                    Series = table.Column<string>(type: "text", nullable: false),
                    ReleaseDate = table.Column<string>(type: "text", nullable: false),
                    LogoUrl = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonSets", x => x.Id);
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

            migrationBuilder.CreateIndex(
                name: "IX_PokemonCards_SetId",
                table: "PokemonCards",
                column: "SetId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonAttacks_PokemonCardId",
                table: "PokemonAttacks",
                column: "PokemonCardId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonResistances_PokemonCardId",
                table: "PokemonResistances",
                column: "PokemonCardId");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonWeaknesses_PokemonCardId",
                table: "PokemonWeaknesses",
                column: "PokemonCardId");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCards_PokemonSets_SetId",
                table: "PokemonCards",
                column: "SetId",
                principalTable: "PokemonSets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCards_PokemonSets_SetId",
                table: "PokemonCards");

            migrationBuilder.DropTable(
                name: "PokemonAttacks");

            migrationBuilder.DropTable(
                name: "PokemonPrices");

            migrationBuilder.DropTable(
                name: "PokemonResistances");

            migrationBuilder.DropTable(
                name: "PokemonSets");

            migrationBuilder.DropTable(
                name: "PokemonWeaknesses");

            migrationBuilder.DropIndex(
                name: "IX_PokemonCards_SetId",
                table: "PokemonCards");

            migrationBuilder.DropColumn(
                name: "EvolvesFrom",
                table: "PokemonCards");

            migrationBuilder.DropColumn(
                name: "Hp",
                table: "PokemonCards");

            migrationBuilder.DropColumn(
                name: "SetId",
                table: "PokemonCards");

            migrationBuilder.RenameColumn(
                name: "Supertype",
                table: "PokemonCards",
                newName: "SetName");

            migrationBuilder.AddColumn<decimal>(
                name: "PriceHigh",
                table: "PokemonCards",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PriceLow",
                table: "PokemonCards",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PriceMid",
                table: "PokemonCards",
                type: "numeric",
                nullable: true);
        }
    }
}
