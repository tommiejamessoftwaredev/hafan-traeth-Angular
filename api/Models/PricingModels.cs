using System.ComponentModel.DataAnnotations;

namespace HafanTraethApi.Models
{
    public class PricingRequest
    {
        [Required]
        public DateTime CheckIn { get; set; }
        [Required]
        public DateTime CheckOut { get; set; }
        public int NumberOfGuests { get; set; } = 1;
    }

    public class PricingResponse
    {
        public decimal BasePrice { get; set; }
        public decimal CleaningFee { get; set; }
        public decimal ServiceFee { get; set; }
        public decimal TotalPrice { get; set; }
        public List<PricingBreakdown> Breakdown { get; set; } = new();
        public int NumberOfNights { get; set; }
    }

    public class PricingBreakdown
    {
        public DateTime Date { get; set; }
        public decimal NightlyRate { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class SeasonalPricing
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Rate { get; set; }
        public string SeasonName { get; set; } = string.Empty;
    }
}