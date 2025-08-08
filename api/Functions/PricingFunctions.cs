using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using HafanTraethApi.Models;

namespace HafanTraethApi.Functions
{
    public class PricingFunctions
    {
        private readonly ILogger<PricingFunctions> _logger;

        public PricingFunctions(ILogger<PricingFunctions> logger)
        {
            _logger = logger;
        }

        [Function("GetPricing")]
        public async Task<HttpResponseData> GetPricing(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("Getting pricing information");

            try
            {
                PricingRequest? request = null;

                if (req.Method == "POST")
                {
                    var requestBody = await req.ReadAsStringAsync();
                    if (!string.IsNullOrEmpty(requestBody))
                    {
                        request = JsonSerializer.Deserialize<PricingRequest>(requestBody, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });
                    }
                }
                else
                {
                    var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
                    if (DateTime.TryParse(query["checkIn"], out var checkIn) &&
                        DateTime.TryParse(query["checkOut"], out var checkOut))
                    {
                        int.TryParse(query["numberOfGuests"], out var guests);
                        request = new PricingRequest 
                        { 
                            CheckIn = checkIn, 
                            CheckOut = checkOut, 
                            NumberOfGuests = guests > 0 ? guests : 1 
                        };
                    }
                }

                if (request == null || request.CheckIn >= request.CheckOut)
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteStringAsync("Invalid date range or request");
                    return badResponse;
                }

                var pricing = CalculatePricing(request);
                
                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json");
                
                var jsonResponse = JsonSerializer.Serialize(pricing, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
                
                await response.WriteStringAsync(jsonResponse);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pricing");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }

        [Function("GetSeasonalRates")]
        public async Task<HttpResponseData> GetSeasonalRates(
            [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequestData req)
        {
            _logger.LogInformation("Getting seasonal rates");

            try
            {
                var seasonalRates = GetSeasonalPricing();
                
                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "application/json");
                
                var jsonResponse = JsonSerializer.Serialize(seasonalRates, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
                
                await response.WriteStringAsync(jsonResponse);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting seasonal rates");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync("Internal server error");
                return errorResponse;
            }
        }

        private static PricingResponse CalculatePricing(PricingRequest request)
        {
            var nights = (request.CheckOut - request.CheckIn).Days;
            var breakdown = new List<PricingBreakdown>();
            var totalBasePrice = 0m;
            var currentDate = request.CheckIn.Date;

            while (currentDate < request.CheckOut.Date)
            {
                var rate = GetNightlyRate(currentDate);
                breakdown.Add(new PricingBreakdown
                {
                    Date = currentDate,
                    NightlyRate = rate,
                    Description = GetSeasonDescription(currentDate)
                });
                totalBasePrice += rate;
                currentDate = currentDate.AddDays(1);
            }

            var cleaningFee = 25m;
            var serviceFee = 15m;
            var totalPrice = totalBasePrice + cleaningFee + serviceFee;

            return new PricingResponse
            {
                BasePrice = totalBasePrice,
                CleaningFee = cleaningFee,
                ServiceFee = serviceFee,
                TotalPrice = totalPrice,
                Breakdown = breakdown,
                NumberOfNights = nights
            };
        }

        private static decimal GetNightlyRate(DateTime date)
        {
            var isWeekend = date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday;
            var baseRate = isWeekend ? 120m : 85m;

            if (date.Month >= 6 && date.Month <= 8)
            {
                baseRate += 20m;
            }
            else if (date.Month == 12 || date.Month == 1)
            {
                baseRate += 15m;
            }

            return baseRate;
        }

        private static string GetSeasonDescription(DateTime date)
        {
            return date.Month switch
            {
                6 or 7 or 8 => "Peak Summer",
                12 or 1 => "Holiday Season",
                3 or 4 or 5 => "Spring",
                9 or 10 or 11 => "Autumn",
                _ => "Standard"
            };
        }

        private static List<SeasonalPricing> GetSeasonalPricing()
        {
            var currentYear = DateTime.Now.Year;
            return new List<SeasonalPricing>
            {
                new()
                {
                    StartDate = new DateTime(currentYear, 6, 1),
                    EndDate = new DateTime(currentYear, 8, 31),
                    Rate = 105m,
                    SeasonName = "Peak Summer"
                },
                new()
                {
                    StartDate = new DateTime(currentYear, 12, 1),
                    EndDate = new DateTime(currentYear + 1, 1, 31),
                    Rate = 100m,
                    SeasonName = "Holiday Season"
                },
                new()
                {
                    StartDate = new DateTime(currentYear, 3, 1),
                    EndDate = new DateTime(currentYear, 5, 31),
                    Rate = 85m,
                    SeasonName = "Spring"
                },
                new()
                {
                    StartDate = new DateTime(currentYear, 9, 1),
                    EndDate = new DateTime(currentYear, 11, 30),
                    Rate = 85m,
                    SeasonName = "Autumn"
                }
            };
        }
    }
}