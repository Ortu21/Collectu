using System.ComponentModel.DataAnnotations;

namespace CardCollectionAPI.Models.User
{
    public class User {
        [Key]
        public int Id { get; set; }
        public required string UserName { get; set; }
        public required DateOnly RegistrationDate {get; set;}       
    }
}