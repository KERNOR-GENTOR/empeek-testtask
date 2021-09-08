using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using TestTask.DTO;
using TestTask.Models;

namespace TestTask.Controllers
{
    [EnableCors("myAllowSpecificOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : Controller
    {
        private readonly ItemDbContext _context;

        public ItemsController(ItemDbContext context)
        {
            _context = context;
        }

        // GET: api/Items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            return await _context.Items.AsNoTracking().ToListAsync();
        }

        // GET: api/Item/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context.Items.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // GET: api/Items/Types
        [HttpGet("Types")]
        public async Task<ActionResult<IEnumerable<TypeDTO>>> GetTypes()
        {
            return await _context.Items.GroupBy(p => p.Type).Select(g => new TypeDTO { Type = g.Key, Count = g.Count() }).AsNoTracking().ToListAsync();
        }

        // Post: api/Item
        [HttpPost]
        public async Task<ActionResult<Item>> PostItem([FromBody] ItemDTO body)
        {
            if (string.IsNullOrEmpty(body.Name) || string.IsNullOrEmpty(body.Type))
            {
                return BadRequest();
            }

            Item item = new Item
            {
                Name = body.Name,
                Type = body.Type
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetItem", new { id = item.Id }, item);
        }

        // PUT: api/Item/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(int id, [FromBody] ItemDTO body)
        {
            if (!ItemExists(id))
            {
                return NotFound();
            }

            Item item = await _context.Items.FirstOrDefaultAsync(e => e.Id == id);
            
            if(item == null)
            {
                return BadRequest();
            }
            
            item.Name = body.Name;
            item.Type = body.Type;

            if (string.IsNullOrEmpty(body.Name) || string.IsNullOrEmpty(body.Type))
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Item/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Item>> DeleteItem(int id)
        {
            var item = await _context.Items.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(item);
        }
        private bool ItemExists(int id)
        {
            return _context.Items.Any(e => e.Id == id);
        }
    }
}
