using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class SistemazioneSetID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCards_PokemonSets_SetId",
                table: "PokemonCards");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonSets",
                table: "PokemonSets");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PokemonSets");

            migrationBuilder.AlterColumn<string>(
                name: "SetId",
                table: "PokemonCards",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonSets",
                table: "PokemonSets",
                column: "SetId");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCards_PokemonSets_SetId",
                table: "PokemonCards",
                column: "SetId",
                principalTable: "PokemonSets",
                principalColumn: "SetId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PokemonCards_PokemonSets_SetId",
                table: "PokemonCards");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PokemonSets",
                table: "PokemonSets");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "PokemonSets",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<int>(
                name: "SetId",
                table: "PokemonCards",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PokemonSets",
                table: "PokemonSets",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PokemonCards_PokemonSets_SetId",
                table: "PokemonCards",
                column: "SetId",
                principalTable: "PokemonSets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
