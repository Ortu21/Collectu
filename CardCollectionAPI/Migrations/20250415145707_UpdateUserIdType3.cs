using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserIdType3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CardInventories_Users_UserId",
                table: "CardInventories");

            migrationBuilder.DropForeignKey(
                name: "FK_CardInventories_Users_UserId1",
                table: "CardInventories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CardInventories",
                table: "CardInventories");

            migrationBuilder.RenameTable(
                name: "CardInventories",
                newName: "CardInventory");

            migrationBuilder.RenameIndex(
                name: "IX_CardInventories_UserId_CardId_CardType",
                table: "CardInventory",
                newName: "IX_CardInventory_UserId_CardId_CardType");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "CardInventory");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CardInventory",
                table: "CardInventory",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CardInventory_Users_UserId",
                table: "CardInventory",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CardInventory_Users_UserId",
                table: "CardInventory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CardInventory",
                table: "CardInventory");

            migrationBuilder.RenameTable(
                name: "CardInventory",
                newName: "CardInventories");

            migrationBuilder.RenameIndex(
                name: "IX_CardInventory_UserId_CardId_CardType",
                table: "CardInventories",
                newName: "IX_CardInventories_UserId_CardId_CardType");

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "CardInventories",
                type: "integer",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CardInventories",
                table: "CardInventories",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CardInventories_Users_UserId",
                table: "CardInventories",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CardInventories_Users_UserId1",
                table: "CardInventories",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
