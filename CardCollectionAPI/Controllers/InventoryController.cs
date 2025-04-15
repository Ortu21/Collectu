using CardCollectionAPI.Models.DTO;
using CardCollectionAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CardCollectionAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController(CardInventoryService inventoryService) : ControllerBase
    {
        private readonly CardInventoryService _inventoryService = inventoryService;

        [HttpPost]
        public async Task<ActionResult<CardInventoryResponseDto>> AddToInventory([FromBody] AddToInventoryDto dto)
        {
            try
            {
                var result = await _inventoryService.AddCardToInventory(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<List<CardInventoryResponseDto>>> GetInventory(int userId)
        {
            try
            {
                var inventory = await _inventoryService.GetUserInventory(userId);
                return Ok(inventory);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CardInventoryResponseDto>> UpdateInventory(int id, [FromBody] UpdateInventoryDto dto)
        {
            try
            {
                var result = await _inventoryService.UpdateInventory(id, dto.Quantity, dto.Condition);
                if (result == null)
                    return NotFound();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromInventory(int id)
        {
            try
            {
                var result = await _inventoryService.RemoveFromInventory(id);
                if (!result)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class UpdateInventoryDto
    {
        public int Quantity { get; set; }
        public string? Condition { get; set; }
    }
} 