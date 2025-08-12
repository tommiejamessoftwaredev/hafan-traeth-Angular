using System.Net;
using System.Text.Json;
using HafanTraethApi.DTOs;
using HafanTraethApi.Exceptions;
using Microsoft.Azure.Functions.Worker.Http;

namespace HafanTraethApi.Extensions
{
    public static class HttpResponseDataExtensions
    {
        public static async Task WriteJsonAsync<T>(
            this HttpResponseData response,
            T data,
            JsonSerializerOptions? options = null
        )
        {
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            var jsonOptions =
                options
                ?? new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = false,
                };

            await response.WriteStringAsync(JsonSerializer.Serialize(data, jsonOptions));
        }

        public static async Task WriteErrorAsync(
            this HttpResponseData response,
            HafanTraethApiException ex
        )
        {
            var error = new ErrorResponseDto
            {
                Error = ex.Message,
                Details = ex.InnerException?.Message,
                StatusCode = ex.StatusCode,
            };

            response.StatusCode = (HttpStatusCode)ex.StatusCode;
            await response.WriteJsonAsync(error);
        }

        public static async Task WriteErrorAsync(
            this HttpResponseData response,
            string message,
            HttpStatusCode statusCode = HttpStatusCode.InternalServerError
        )
        {
            var error = new ErrorResponseDto { Error = message, StatusCode = (int)statusCode };

            response.StatusCode = statusCode;
            await response.WriteJsonAsync(error);
        }

        public static void AddCorsHeaders(this HttpResponseData response)
        {
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        }

        public static void AddCorsPreflightHeaders(this HttpResponseData response)
        {
            response.AddCorsHeaders();
            response.Headers.Add("Access-Control-Max-Age", "86400");
        }
    }
}
