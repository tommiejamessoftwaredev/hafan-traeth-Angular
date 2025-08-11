using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace HafanTraethApi.Functions
{
    public class ConfigurationFunctions
    {
        private readonly ILogger _logger;

        public ConfigurationFunctions(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<ConfigurationFunctions>();
        }

        [Function("GetConfiguration")]
        public async Task<HttpResponseData> GetConfiguration(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req
        )
        {
            _logger.LogInformation("Getting application configuration");

            try
            {
                var config = new
                {
                    googleMapsApiKey = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY")
                        ?? "",
                    apiUrl = Environment.GetEnvironmentVariable("API_BASE_URL")
                        ?? req.Url.GetLeftPart(UriPartial.Authority) + "/api",
                    bookingComUrl = Environment.GetEnvironmentVariable("BOOKING_COM_URL")
                        ?? "https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html",
                    bookingComReviewsUrl = Environment.GetEnvironmentVariable(
                        "BOOKING_COM_REVIEWS_URL"
                    ) ?? "https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html#tab-reviews",
                    airbnbUrl = Environment.GetEnvironmentVariable("AIRBNB_URL")
                        ?? "https://www.airbnb.co.uk/rooms/920441523710400719",
                    airbnbReviewsUrl = Environment.GetEnvironmentVariable("AIRBNB_REVIEWS_URL")
                        ?? "https://www.airbnb.co.uk/rooms/920441523710400719/reviews",
                    icalUrl = Environment.GetEnvironmentVariable("ICAL_URL")
                        ?? "https://ical.booking.com/v1/export?t=32f37ade-b2ed-48b9-9e49-573b6dcc4660",
                    busRoute35PdfUrl = Environment.GetEnvironmentVariable("BUS_ROUTE_35_PDF_URL")
                        ?? "/36-Rhyl-Circular-from-26-Jan-2025.pdf",
                    busRoute36PdfUrl = Environment.GetEnvironmentVariable("BUS_ROUTE_36_PDF_URL")
                        ?? "/35-Rhyl-Circular-from-26-Jan-2025.pdf",
                    busRoute35PlannerUrl = Environment.GetEnvironmentVariable(
                        "BUS_ROUTE_35_PLANNER_URL"
                    ) ?? "https://www.arrivabus.co.uk/find-a-service/35-rhyl-circular",
                    busRoute36PlannerUrl = Environment.GetEnvironmentVariable(
                        "BUS_ROUTE_36_PLANNER_URL"
                    ) ?? "https://www.arrivabus.co.uk/find-a-service/36-rhyl-circular",
                };

                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json; charset=utf-8");

                // Add CORS headers for frontend access
                response.Headers.Add("Access-Control-Allow-Origin", "*");
                response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
                response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

                await response.WriteStringAsync(
                    JsonSerializer.Serialize(
                        config,
                        new JsonSerializerOptions
                        {
                            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                        }
                    )
                );

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting configuration");

                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync(
                    JsonSerializer.Serialize(new { error = "Failed to load configuration" })
                );
                return errorResponse;
            }
        }

        [Function("ConfigurationOptions")]
        public HttpResponseData ConfigurationOptions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "options")] HttpRequestData req
        )
        {
            var response = req.CreateResponse(HttpStatusCode.OK);

            // CORS preflight response
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
            response.Headers.Add("Access-Control-Max-Age", "86400");

            return response;
        }
    }
}
