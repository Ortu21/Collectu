using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCardInheritance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonAttacks_PokemonCards_PokemonCardId",
                table: "PokemonAttacks");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCardMarketPrices_PokemonCards_PokemonCardId",
                table: "PokemonCardMarketPrices");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCards_PokemonSets_SetId",
                table: "PokemonCards");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCardTcgPrices_PokemonCards_PokemonCardId",
                table: "PokemonCardTcgPrices");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonResistances_PokemonCards_PokemonCardId",
                table: "PokemonResistances");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonWeaknesses_PokemonCards_PokemonCardId",
                table: "PokemonWeaknesses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonCards",
                table: "PokemonCards");

            migrationBuilder.RenameTable(
                name: "PokemonCards",
                newName: "Cards");

            migrationBuilder.RenameIndex(
                name: "IX_PokemonCards_SetId",
                table: "Cards",
                newName: "IX_Cards_SetId");

            migrationBuilder.AlterColumn<string>(
                name: "Supertype",
                table: "Cards",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Rarity",
                table: "Cards",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "LargeImageUrl",
                table: "Cards",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "EvolvesFrom",
                table: "Cards",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "CardType",
                table: "Cards",
                type: "character varying(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Cards",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Cards",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cards",
                table: "Cards",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_PokemonSets_SetId",
                table: "Cards",
                column: "SetId",
                principalTable: "PokemonSets",
                principalColumn: "SetId");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonAttacks_Cards_PokemonCardId",
                table: "PokemonAttacks",
                column: "PokemonCardId",
                principalTable: "Cards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardMarketPrices_Cards_PokemonCardId",
                table: "PokemonCardMarketPrices",
                column: "PokemonCardId",
                principalTable: "Cards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardTcgPrices_Cards_PokemonCardId",
                table: "PokemonCardTcgPrices",
                column: "PokemonCardId",
                principalTable: "Cards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonResistances_Cards_PokemonCardId",
                table: "PokemonResistances",
                column: "PokemonCardId",
                principalTable: "Cards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonWeaknesses_Cards_PokemonCardId",
                table: "PokemonWeaknesses",
                column: "PokemonCardId",
                principalTable: "Cards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_PokemonSets_SetId",
                table: "Cards");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonAttacks_Cards_PokemonCardId",
                table: "PokemonAttacks");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCardMarketPrices_Cards_PokemonCardId",
                table: "PokemonCardMarketPrices");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCardTcgPrices_Cards_PokemonCardId",
                table: "PokemonCardTcgPrices");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonResistances_Cards_PokemonCardId",
                table: "PokemonResistances");

            migrationBuilder.DropForeignKey(
                name: "FK_PokemonWeaknesses_Cards_PokemonCardId",
                table: "PokemonWeaknesses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Cards",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "CardType",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Cards");

            migrationBuilder.RenameTable(
                name: "Cards",
                newName: "PokemonCards");

            migrationBuilder.RenameIndex(
                name: "IX_Cards_SetId",
                table: "PokemonCards",
                newName: "IX_PokemonCards_SetId");

            migrationBuilder.AlterColumn<string>(
                name: "Supertype",
                table: "PokemonCards",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Rarity",
                table: "PokemonCards",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LargeImageUrl",
                table: "PokemonCards",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EvolvesFrom",
                table: "PokemonCards",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonCards",
                table: "PokemonCards",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonAttacks_PokemonCards_PokemonCardId",
                table: "PokemonAttacks",
                column: "PokemonCardId",
                principalTable: "PokemonCards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardMarketPrices_PokemonCards_PokemonCardId",
                table: "PokemonCardMarketPrices",
                column: "PokemonCardId",
                principalTable: "PokemonCards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCards_PokemonSets_SetId",
                table: "PokemonCards",
                column: "SetId",
                principalTable: "PokemonSets",
                principalColumn: "SetId");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCardTcgPrices_PokemonCards_PokemonCardId",
                table: "PokemonCardTcgPrices",
                column: "PokemonCardId",
                principalTable: "PokemonCards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonResistances_PokemonCards_PokemonCardId",
                table: "PokemonResistances",
                column: "PokemonCardId",
                principalTable: "PokemonCards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonWeaknesses_PokemonCards_PokemonCardId",
                table: "PokemonWeaknesses",
                column: "PokemonCardId",
                principalTable: "PokemonCards",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
