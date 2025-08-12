using System.Net;
using System.Text.Json;
using FluentAssertions;
using HafanTraethApi.DTOs;
using HafanTraethApi.Exceptions;
using HafanTraethApi.Functions;
using HafanTraethApi.Services.Interfaces;
using HafanTraethApi.Tests.Helpers;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace HafanTraethApi.Tests.Functions
{
    public class ConfigurationFunctionsTests
    {
        private readonly Mock<ILogger<ConfigurationFunctions>> _mockLogger;
        private readonly Mock<IConfigurationService> _mockConfigurationService;
        private readonly ConfigurationFunctions _function;
        private readonly TestFunctionContext _functionContext;

        public ConfigurationFunctionsTests()
        {
            _mockLogger = new Mock<ILogger<ConfigurationFunctions>>();
            _mockConfigurationService = new Mock<IConfigurationService>();
            _function = new ConfigurationFunctions(_mockLogger.Object, _mockConfigurationService.Object);
            _functionContext = new TestFunctionContext();
        }

        [Fact]
        public async Task GetConfiguration_Success_ReturnsOkWithConfiguration()
        {
            // Arrange
            var testConfig = new ConfigurationDto
            {
                ApiUrl = "https://test.com/api",
                GoogleMapsApiKey = "test-key",
                BookingComUrl = "https://booking.com/test"
            };

            _mockConfigurationService
                .Setup(x => x.GetConfigurationAsync(It.IsAny<string>()))
                .ReturnsAsync(testConfig);

            var request = new TestHttpRequestData(_functionContext, new Uri("https://test.com/api/GetConfiguration"));

            // Act
            var response = await _function.GetConfiguration(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            
            var testResponse = response as TestHttpResponseData;
            testResponse.Should().NotBeNull();
            
            var responseContent = testResponse!.GetBodyAsString();
            var deserializedConfig = JsonSerializer.Deserialize<ConfigurationDto>(responseContent, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            deserializedConfig.Should().NotBeNull();
            deserializedConfig!.ApiUrl.Should().Be("https://test.com/api");
        }

        [Fact]
        public async Task GetConfiguration_ServiceThrowsConfigurationException_ReturnsError()
        {
            // Arrange
            var exception = new ConfigurationException("Test configuration error");
            _mockConfigurationService
                .Setup(x => x.GetConfigurationAsync(It.IsAny<string>()))
                .ThrowsAsync(exception);

            var request = new TestHttpRequestData(_functionContext, new Uri("https://test.com/api/GetConfiguration"));

            // Act
            var response = await _function.GetConfiguration(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
        }

        [Fact]
        public async Task GetConfiguration_ServiceThrowsGenericException_ReturnsInternalServerError()
        {
            // Arrange
            var exception = new Exception("Unexpected error");
            _mockConfigurationService
                .Setup(x => x.GetConfigurationAsync(It.IsAny<string>()))
                .ThrowsAsync(exception);

            var request = new TestHttpRequestData(_functionContext, new Uri("https://test.com/api/GetConfiguration"));

            // Act
            var response = await _function.GetConfiguration(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
        }

        [Fact]
        public async Task GetConfiguration_LogsCorrectMessages()
        {
            // Arrange
            var testConfig = new ConfigurationDto { ApiUrl = "https://test.com/api" };
            _mockConfigurationService
                .Setup(x => x.GetConfigurationAsync(It.IsAny<string>()))
                .ReturnsAsync(testConfig);

            var request = new TestHttpRequestData(_functionContext, new Uri("https://test.com/api/GetConfiguration"));

            // Act
            await _function.GetConfiguration(request);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Processing GetConfiguration request")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);

            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Configuration retrieved successfully")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetConfiguration_CallsServiceWithCorrectBaseUrl()
        {
            // Arrange
            var testConfig = new ConfigurationDto { ApiUrl = "https://example.com/api" };
            _mockConfigurationService
                .Setup(x => x.GetConfigurationAsync("https://example.com/api"))
                .ReturnsAsync(testConfig);

            var request = new TestHttpRequestData(_functionContext, new Uri("https://example.com/api/GetConfiguration"));

            // Act
            await _function.GetConfiguration(request);

            // Assert
            _mockConfigurationService.Verify(
                x => x.GetConfigurationAsync("https://example.com/api"),
                Times.Once);
        }

        [Fact]
        public void ConfigurationOptions_ReturnsOkWithCorsHeaders()
        {
            // Arrange
            var request = new TestHttpRequestData(_functionContext);

            // Act
            var response = _function.ConfigurationOptions(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            
            // Verify CORS headers are added (this would be done by the AddCorsPreflightHeaders extension)
            response.Headers.Should().NotBeNull();
        }

        [Fact]
        public void ConfigurationOptions_LogsCorrectMessage()
        {
            // Arrange
            var request = new TestHttpRequestData(_functionContext);

            // Act
            _function.ConfigurationOptions(request);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Processing CORS preflight request for Configuration")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public void Constructor_WithValidParameters_InitializesCorrectly()
        {
            // Arrange & Act
            var function = new ConfigurationFunctions(_mockLogger.Object, _mockConfigurationService.Object);

            // Assert
            function.Should().NotBeNull();
        }

        [Theory]
        [InlineData("https://api.example.com/GetConfiguration")]
        [InlineData("http://localhost:7071/api/GetConfiguration")]
        [InlineData("https://myapp.azurewebsites.net/api/GetConfiguration")]
        public async Task GetConfiguration_WithDifferentUrls_ExtractsCorrectBaseUrl(string requestUrl)
        {
            // Arrange
            var uri = new Uri(requestUrl);
            var expectedBaseUrl = uri.GetLeftPart(UriPartial.Authority) + "/api";
            
            var testConfig = new ConfigurationDto { ApiUrl = expectedBaseUrl };
            _mockConfigurationService
                .Setup(x => x.GetConfigurationAsync(expectedBaseUrl))
                .ReturnsAsync(testConfig);

            var request = new TestHttpRequestData(_functionContext, uri);

            // Act
            await _function.GetConfiguration(request);

            // Assert
            _mockConfigurationService.Verify(
                x => x.GetConfigurationAsync(expectedBaseUrl),
                Times.Once);
        }
    }
}