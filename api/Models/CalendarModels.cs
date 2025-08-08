using System.ComponentModel.DataAnnotations;

namespace HafanTraethApi.Models
{
    public class AvailabilityRequest
    {
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }
    }

    public class AvailabilityResponse
    {
        public List<DateAvailability> Dates { get; set; } = new();
    }

    public class DateAvailability
    {
        public DateTime Date { get; set; }
        public bool IsAvailable { get; set; }
        public decimal? Price { get; set; }
        public int MinimumStay { get; set; } = 1;
    }

    public class BookingRequest
    {
        [Required]
        public DateTime CheckIn { get; set; }
        [Required]
        public DateTime CheckOut { get; set; }
        [Required]
        public string GuestName { get; set; } = string.Empty;
        [Required]
        public string GuestEmail { get; set; } = string.Empty;
        public string GuestPhone { get; set; } = string.Empty;
        public int NumberOfGuests { get; set; } = 1;
        public string SpecialRequests { get; set; } = string.Empty;
    }

    public class BookingResponse
    {
        public bool Success { get; set; }
        public string BookingId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
    }
}