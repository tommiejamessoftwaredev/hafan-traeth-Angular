using System.Net;
using HafanTraethApi.Exceptions;
using HafanTraethApi.Extensions;
using HafanTraethApi.Services.Interfaces;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace HafanTraethApi.Functions
{
    public class ICalFunctions
    {
        private readonly ILogger<ICalFunctions> _logger;
        private readonly IICalService _iCalService;

        public ICalFunctions(ILogger<ICalFunctions> logger, IICalService iCalService)
        {
            _logger = logger;
            _iCalService = iCalService;
        }

        [Function("GetICalData")]
        public async Task<HttpResponseData> GetICalData(
            [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequestData req
        )
        {
            _logger.LogInformation("Processing GetICalData request");

            var response = req.CreateResponse();
            response.AddCorsHeaders();

            try
            {
                var iCalData = await _iCalService.GetICalDataAsync();

                response.StatusCode = HttpStatusCode.OK;
                response.Headers.Add("Content-Type", iCalData.ContentType);
                response.Headers.Add("Last-Modified", iCalData.LastModified.ToString("R"));

                await response.WriteStringAsync(iCalData.Data);

                _logger.LogInformation(
                    "iCal data retrieved successfully ({DataSize} bytes)",
                    System.Text.Encoding.UTF8.GetByteCount(iCalData.Data)
                );

                return response;
            }
            catch (HafanTraethApiException ex)
            {
                _logger.LogError(ex, "Business logic error in GetICalData");
                await response.WriteErrorAsync(ex);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetICalData");
                await response.WriteErrorAsync(
                    "An unexpected error occurred",
                    HttpStatusCode.InternalServerError
                );
                return response;
            }
        }

        [Function("GetICalEvents")]
        public async Task<HttpResponseData> GetICalEvents(
            [HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequestData req
        )
        {
            _logger.LogInformation("Processing GetICalEvents request");

            var response = req.CreateResponse();
            response.AddCorsHeaders();

            try
            {
                var iCalData = await _iCalService.GetICalDataAsync();
                var events = await _iCalService.ParseICalEventsAsync(iCalData.Data);

                response.StatusCode = HttpStatusCode.OK;
                await response.WriteJsonAsync(events);

                _logger.LogInformation(
                    "iCal events parsed successfully ({EventCount} events)",
                    events.Count
                );
                return response;
            }
            catch (HafanTraethApiException ex)
            {
                _logger.LogError(ex, "Business logic error in GetICalEvents");
                await response.WriteErrorAsync(ex);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetICalEvents");
                await response.WriteErrorAsync(
                    "An unexpected error occurred",
                    HttpStatusCode.InternalServerError
                );
                return response;
            }
        }

        [Function("ICalOptions")]
        public HttpResponseData ICalOptions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "options")] HttpRequestData req
        )
        {
            _logger.LogInformation("Processing CORS preflight request for iCal");

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.AddCorsPreflightHeaders();

            return response;
        }
    }
}
