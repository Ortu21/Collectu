using CardCollectionAPI.Data;
using CardCollectionAPI.Models;
using CardCollectionAPI.Models.DTO;
using Microsoft.EntityFrameworkCore;

namespace CardCollectionAPI.Services
{
    public class CardInventoryService(AppDbContext context)
    {
        private readonly AppDbContext _context = context;

        public async Task<CardInventoryResponseDto> AddCardToInventory(AddToInventoryDto dto)
        {
            var inventory = new CardInventory
            {
                UserId = dto.UserId,
                CardId = dto.CardId,
                CardType = dto.CardType,
                Quantity = dto.Quantity,
                Condition = dto.Condition
            };

            _context.CardInventories.Add(inventory);
            await _context.SaveChangesAsync();

            return new CardInventoryResponseDto
            {
                Id = inventory.Id,
                UserId = inventory.UserId,
                CardId = inventory.CardId,
                CardType = inventory.CardType,
                Quantity = inventory.Quantity,
                Condition = inventory.Condition
            };
        }

        public async Task<List<CardInventoryResponseDto>> GetUserInventory(string userId)
        {
            var inventories = await _context.CardInventories
                .Where(i => i.UserId == userId)
                .ToListAsync();

            return inventories.Select(i => new CardInventoryResponseDto
            {
                Id = i.Id,
                UserId = i.UserId,
                CardId = i.CardId,
                CardType = i.CardType,
                Quantity = i.Quantity,
                Condition = i.Condition
            }).ToList();
        }

        public async Task<CardInventoryResponseDto?> UpdateInventory(int id, int quantity, string? condition)
        {
            var inventory = await _context.CardInventories
                .FirstOrDefaultAsync(i => i.Id == id);

            if (inventory == null)
                return null;

            inventory.Quantity = quantity;
            inventory.Condition = condition;

            await _context.SaveChangesAsync();

            return new CardInventoryResponseDto
            {
                Id = inventory.Id,
                UserId = inventory.UserId,
                CardId = inventory.CardId,
                CardType = inventory.CardType,
                Quantity = inventory.Quantity,
                Condition = inventory.Condition
            };
        }

        public async Task<bool> RemoveFromInventory(int id)
        {
            var inventory = await _context.CardInventories.FindAsync(id);
            if (inventory == null)
                return false;

            _context.CardInventories.Remove(inventory);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 