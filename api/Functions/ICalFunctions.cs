using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace HafanTraethApi.Functions
{
    public class ICalFunctions
    {
        private readonly ILogger<ICalFunctions> _logger;

        public ICalFunctions(ILogger<ICalFunctions> logger)
        {
            _logger = logger;
        }

        [Function("GetICalData")]
        public async Task<HttpResponseData> GetICalData(
            [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequestData req)
        {
            _logger.LogInformation("Getting iCal data from Booking.com");

            try
            {
                // Get iCal URL from environment variables
                var icalUrl = Environment.GetEnvironmentVariable("ICAL_URL");
                if (string.IsNullOrEmpty(icalUrl))
                {
                    _logger.LogWarning("ICAL_URL not configured in environment variables");
                    var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                    await errorResponse.WriteStringAsync("iCal URL not configured");
                    return errorResponse;
                }

                _logger.LogInformation($"Fetching iCal data from: {icalUrl}");

                // Create HttpClient for this request
                using var httpClient = new HttpClient();
                httpClient.Timeout = TimeSpan.FromSeconds(30);
                
                // Fetch iCal data
                var icalData = await httpClient.GetStringAsync(icalUrl);
                
                _logger.LogInformation($"Successfully fetched iCal data ({icalData.Length} characters)");
                
                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "text/calendar");
                response.Headers.Add("Access-Control-Allow-Origin", "*");
                response.Headers.Add("Access-Control-Allow-Methods", "GET");
                response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
                
                await response.WriteStringAsync(icalData);
                return response;
            }
            catch (HttpRequestException httpEx)
            {
                _logger.LogError(httpEx, "HTTP error fetching iCal data");
                var errorResponse = req.CreateResponse(HttpStatusCode.BadGateway);
                await errorResponse.WriteStringAsync($"Error connecting to iCal source: {httpEx.Message}");
                return errorResponse;
            }
            catch (TaskCanceledException timeoutEx)
            {
                _logger.LogError(timeoutEx, "Timeout fetching iCal data");
                var errorResponse = req.CreateResponse(HttpStatusCode.RequestTimeout);
                await errorResponse.WriteStringAsync("Timeout fetching iCal data");
                return errorResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error fetching iCal data");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteStringAsync($"Unexpected error: {ex.Message}");
                return errorResponse;
            }
        }
    }
}