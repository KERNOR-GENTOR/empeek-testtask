using System.ComponentModel.DataAnnotations;

namespace TestTask.Models
{
    public class Item
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }
    }
}
