using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using HafanTraethApi.Models;

namespace HafanTraethApi.Functions
{
    public class CalendarFunctions
    {
        private readonly ILogger<CalendarFunctions> _logger;

        public CalendarFunctions(ILogger<CalendarFunctions> logger)
        {
            _logger = logger;
        }

        [Function("GetAvailability")]
        public async Task<HttpResponseData> GetAvailability(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("Getting availability information");

            try
            {
                AvailabilityRequest? request = null;

                if (req.Method == "POST")
                {
                    var requestBody = await req.ReadAsStringAsync();
                    if (!string.IsNullOrEmpty(requestBody))
                    {
                        request = JsonSerializer.Deserialize<AvailabilityRequest>(requestBody, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });
                    }
                }
                else
                {
                    var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
                    if (DateTime.TryParse(query["startDate"], out var startDate) &&
                        DateTime.TryParse(query["endDate"], out var endDate))
                    {
                        request = new AvailabilityRequest { StartDate = startDate, EndDate = endDate };
                    }
                }

                if (request == null || request.StartDate >= request.EndDate)
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteStringAsync("Invalid date range");
                    return badResponse;
                }

                var availability = GenerateAvailability(request.StartDate, request.EndDate);
                
                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json");
                
                var jsonResponse = JsonSerializer.Serialize(availability, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
                
                await response.WriteStringAsync(jsonResponse);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting availability");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }

        [Function("CreateBooking")]
        public async Task<HttpResponseData> CreateBooking(
            [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequestData req)
        {
            _logger.LogInformation("Creating new booking");

            try
            {
                var requestBody = await req.ReadAsStringAsync();
                if (string.IsNullOrEmpty(requestBody))
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteStringAsync("Request body is required");
                    return badResponse;
                }

                var bookingRequest = JsonSerializer.Deserialize<BookingRequest>(requestBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (bookingRequest == null || bookingRequest.CheckIn >= bookingRequest.CheckOut)
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteStringAsync("Invalid booking request");
                    return badResponse;
                }

                var bookingResponse = ProcessBooking(bookingRequest);
                
                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json");
                
                var jsonResponse = JsonSerializer.Serialize(bookingResponse, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
                
                await response.WriteStringAsync(jsonResponse);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating booking");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }

        private static AvailabilityResponse GenerateAvailability(DateTime startDate, DateTime endDate)
        {
            var availability = new AvailabilityResponse();
            var currentDate = startDate.Date;
            var random = new Random();

            while (currentDate <= endDate.Date)
            {
                var isWeekend = currentDate.DayOfWeek == DayOfWeek.Saturday || currentDate.DayOfWeek == DayOfWeek.Sunday;
                var basePrice = isWeekend ? 120m : 85m;
                
                var isAvailable = random.Next(1, 100) > 20;
                
                availability.Dates.Add(new DateAvailability
                {
                    Date = currentDate,
                    IsAvailable = isAvailable,
                    Price = isAvailable ? basePrice : null,
                    MinimumStay = isWeekend ? 2 : 1
                });

                currentDate = currentDate.AddDays(1);
            }

            return availability;
        }

        private static BookingResponse ProcessBooking(BookingRequest request)
        {
            var nights = (request.CheckOut - request.CheckIn).Days;
            var basePrice = CalculateBasePrice(request.CheckIn, request.CheckOut);
            var totalPrice = basePrice + 25m + 15m;

            return new BookingResponse
            {
                Success = true,
                BookingId = Guid.NewGuid().ToString(),
                Message = "Booking created successfully",
                TotalPrice = totalPrice
            };
        }

        private static decimal CalculateBasePrice(DateTime checkIn, DateTime checkOut)
        {
            var nights = (checkOut - checkIn).Days;
            var totalPrice = 0m;
            var currentDate = checkIn.Date;

            while (currentDate < checkOut.Date)
            {
                var isWeekend = currentDate.DayOfWeek == DayOfWeek.Saturday || currentDate.DayOfWeek == DayOfWeek.Sunday;
                totalPrice += isWeekend ? 120m : 85m;
                currentDate = currentDate.AddDays(1);
            }

            return totalPrice;
        }
    }
}