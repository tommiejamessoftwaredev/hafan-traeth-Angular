using System.ComponentModel.DataAnnotations;

namespace HafanTraethApi.DTOs
{
    public class ConfigurationDto
    {
        [Required]
        public string GoogleMapsApiKey { get; set; } = string.Empty;

        [Required]
        public string ApiUrl { get; set; } = string.Empty;

        [Required]
        public string BookingComUrl { get; set; } = string.Empty;

        [Required]
        public string BookingComReviewsUrl { get; set; } = string.Empty;

        [Required]
        public string AirbnbUrl { get; set; } = string.Empty;

        [Required]
        public string AirbnbReviewsUrl { get; set; } = string.Empty;

        [Required]
        public string IcalUrl { get; set; } = string.Empty;

        [Required]
        public string BusRoute35PdfUrl { get; set; } = string.Empty;

        [Required]
        public string BusRoute36PdfUrl { get; set; } = string.Empty;

        [Required]
        public string BusRoute35PlannerUrl { get; set; } = string.Empty;

        [Required]
        public string BusRoute36PlannerUrl { get; set; } = string.Empty;
    }
}
