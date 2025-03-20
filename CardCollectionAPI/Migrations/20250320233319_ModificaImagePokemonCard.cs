using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class ModificaImagePokemonCard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "PokemonCards",
                newName: "LargeImageUrl");

            migrationBuilder.AddColumn<string>(
                name: "SmallImageUrl",
                table: "PokemonCards",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SmallImageUrl",
                table: "PokemonCards");

            migrationBuilder.RenameColumn(
                name: "LargeImageUrl",
                table: "PokemonCards",
                newName: "ImageUrl");
        }
    }
}
