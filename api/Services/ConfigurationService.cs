using HafanTraethApi.DTOs;
using HafanTraethApi.Exceptions;
using HafanTraethApi.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace HafanTraethApi.Services
{
    public class ConfigurationService : IConfigurationService
    {
        private readonly ILogger<ConfigurationService> _logger;

        public ConfigurationService(ILogger<ConfigurationService> logger)
        {
            _logger = logger;
        }

        public Task<ConfigurationDto> GetConfigurationAsync()
        {
            return GetConfigurationAsync(null);
        }

        public Task<ConfigurationDto> GetConfigurationAsync(string? baseUrl)
        {
            _logger.LogInformation("Retrieving application configuration");

            try
            {
                var config = new ConfigurationDto
                {
                    GoogleMapsApiKey = GetEnvironmentVariable("GOOGLE_MAPS_API_KEY"),
                    ApiUrl = GetEnvironmentVariable("API_BASE_URL", baseUrl ?? ""),
                    BookingComUrl = GetEnvironmentVariable(
                        "BOOKING_COM_URL",
                        "https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html"
                    ),
                    BookingComReviewsUrl = GetEnvironmentVariable(
                        "BOOKING_COM_REVIEWS_URL",
                        "https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html#tab-reviews"
                    ),
                    AirbnbUrl = GetEnvironmentVariable(
                        "AIRBNB_URL",
                        "https://www.airbnb.co.uk/rooms/920441523710400719"
                    ),
                    AirbnbReviewsUrl = GetEnvironmentVariable(
                        "AIRBNB_REVIEWS_URL",
                        "https://www.airbnb.co.uk/rooms/920441523710400719/reviews"
                    ),
                    IcalUrl = GetEnvironmentVariable(
                        "ICAL_URL",
                        "https://ical.booking.com/v1/export?t=32f37ade-b2ed-48b9-9e49-573b6dcc4660"
                    ),
                    BusRoute35PdfUrl = GetEnvironmentVariable(
                        "BUS_ROUTE_35_PDF_URL",
                        "/36-Rhyl-Circular-from-26-Jan-2025.pdf"
                    ),
                    BusRoute36PdfUrl = GetEnvironmentVariable(
                        "BUS_ROUTE_36_PDF_URL",
                        "/35-Rhyl-Circular-from-26-Jan-2025.pdf"
                    ),
                    BusRoute35PlannerUrl = GetEnvironmentVariable(
                        "BUS_ROUTE_35_PLANNER_URL",
                        "https://www.arrivabus.co.uk/find-a-service/35-rhyl-circular"
                    ),
                    BusRoute36PlannerUrl = GetEnvironmentVariable(
                        "BUS_ROUTE_36_PLANNER_URL",
                        "https://www.arrivabus.co.uk/find-a-service/36-rhyl-circular"
                    ),
                };

                _logger.LogInformation("Configuration retrieved successfully");
                return Task.FromResult(config);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving configuration");
                throw new ConfigurationException("Failed to retrieve configuration", ex);
            }
        }

        private static string GetEnvironmentVariable(string name, string defaultValue = "")
        {
            return Environment.GetEnvironmentVariable(name) ?? defaultValue;
        }
    }
}
