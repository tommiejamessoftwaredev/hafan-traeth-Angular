using System.Net;
using HafanTraethApi.Exceptions;
using HafanTraethApi.Extensions;
using HafanTraethApi.Services.Interfaces;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace HafanTraethApi.Functions
{
    public class ConfigurationFunctions
    {
        private readonly ILogger<ConfigurationFunctions> _logger;
        private readonly IConfigurationService _configurationService;

        public ConfigurationFunctions(
            ILogger<ConfigurationFunctions> logger,
            IConfigurationService configurationService
        )
        {
            _logger = logger;
            _configurationService = configurationService;
        }

        [Function("GetConfiguration")]
        public async Task<HttpResponseData> GetConfiguration(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req
        )
        {
            _logger.LogInformation("Processing GetConfiguration request");

            var response = req.CreateResponse();
            response.AddCorsHeaders();

            try
            {
                var baseUrl = req.Url.GetLeftPart(UriPartial.Authority) + "/api";
                var config = await _configurationService.GetConfigurationAsync(baseUrl);

                response.StatusCode = HttpStatusCode.OK;
                await response.WriteJsonAsync(config);

                _logger.LogInformation("Configuration retrieved successfully");
                return response;
            }
            catch (HafanTraethApiException ex)
            {
                _logger.LogError(ex, "Business logic error in GetConfiguration");
                await response.WriteErrorAsync(ex);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetConfiguration");
                await response.WriteErrorAsync(
                    "An unexpected error occurred",
                    HttpStatusCode.InternalServerError
                );
                return response;
            }
        }

        [Function("ConfigurationOptions")]
        public HttpResponseData ConfigurationOptions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "options")] HttpRequestData req
        )
        {
            _logger.LogInformation("Processing CORS preflight request for Configuration");

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.AddCorsPreflightHeaders();

            return response;
        }
    }
}
