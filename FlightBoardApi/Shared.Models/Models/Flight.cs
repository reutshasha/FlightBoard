
using System.ComponentModel.DataAnnotations;

namespace Shared.Models.Models
{
    public class Flight
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Flight number is required.")]
        [StringLength(10, ErrorMessage = "Flight number must be up to 10 characters.")]
        [RegularExpression(@"^[A-Z]{2}\d{3,6}$", ErrorMessage = "Flight number must start with 2 letters followed by 3–6 digits (e.g., LY1234).")]
        public string FlightNumber { get; set; }

        [Required(ErrorMessage = "Destination is required.")]
        [StringLength(50, ErrorMessage = "Destination must be up to 50 characters.")]
        public string Destination { get; set; }

        [Required(ErrorMessage = "Gate is required.")]
        [StringLength(5, ErrorMessage = "Gate must be up to 5 characters.")]
        [RegularExpression(@"^[A-Z]?\d{1,3}$", ErrorMessage = "Gate format is invalid (e.g., A12 or 5).")]
        public string Gate { get; set; }

        [Required(ErrorMessage = "Departure time is required.")]
        [DataType(DataType.DateTime)]
        public DateTime DepartureTime { get; set; }
    }
}
