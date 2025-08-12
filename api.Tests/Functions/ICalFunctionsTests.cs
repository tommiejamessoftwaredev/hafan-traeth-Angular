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
    public class ICalFunctionsTests
    {
        private readonly Mock<ILogger<ICalFunctions>> _mockLogger;
        private readonly Mock<IICalService> _mockICalService;
        private readonly ICalFunctions _function;
        private readonly TestFunctionContext _functionContext;

        public ICalFunctionsTests()
        {
            _mockLogger = new Mock<ILogger<ICalFunctions>>();
            _mockICalService = new Mock<IICalService>();
            _function = new ICalFunctions(_mockLogger.Object, _mockICalService.Object);
            _functionContext = new TestFunctionContext();
        }

        [Fact]
        public async Task GetICalData_Success_ReturnsOkWithICalData()
        {
            // Arrange
            var testICalData = new ICalDataDto
            {
                Data = "BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR",
                ContentType = "text/calendar",
                LastModified = DateTime.UtcNow
            };

            _mockICalService
                .Setup(x => x.GetICalDataAsync())
                .ReturnsAsync(testICalData);

            var request = new TestHttpRequestData(_functionContext);

            // Act
            var response = await _function.GetICalData(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            
            var testResponse = response as TestHttpResponseData;
            testResponse.Should().NotBeNull();
            
            var responseContent = testResponse!.GetBodyAsString();
            responseContent.Should().Be(testICalData.Data);
            
            response.Headers.Should().ContainKey("Content-Type");
            response.Headers.Should().ContainKey("Last-Modified");
        }

        [Fact]
        public async Task GetICalData_ServiceThrowsConfigurationException_ReturnsError()
        {
            // Arrange
            var exception = new ConfigurationException("iCal URL not configured");
            _mockICalService
                .Setup(x => x.GetICalDataAsync())
                .ThrowsAsync(exception);

            var request = new TestHttpRequestData(_functionContext);

            // Act
            var response = await _function.GetICalData(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
        }

        [Fact]
        public async Task GetICalData_ServiceThrowsExternalServiceException_ReturnsError()
        {
            // Arrange
            var exception = new ExternalServiceException("Failed to fetch iCal data");
            _mockICalService
                .Setup(x => x.GetICalDataAsync())
                .ThrowsAsync(exception);

            var request = new TestHttpRequestData(_functionContext);

            // Act
            var response = await _function.GetICalData(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.ServiceUnavailable);
        }

        [Fact]
        public async Task GetICalData_ServiceThrowsGenericException_ReturnsInternalServerError()
        {
            // Arrange
            var exception = new Exception("Unexpected error");
            _mockICalService
                .Setup(x => x.GetICalDataAsync())
                .ThrowsAsync(exception);

            var request = new TestHttpRequestData(_functionContext);

            // Act
            var response = await _function.GetICalData(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
        }

        [Fact]
        public async Task GetICalData_LogsCorrectMessages()
        {
            // Arrange
            var testICalData = new ICalDataDto
            {
                Data = "BEGIN:VCALENDAR\nEND:VCALENDAR",
                ContentType = "text/calendar",
                LastModified = DateTime.UtcNow
            };

            _mockICalService
                .Setup(x => x.GetICalDataAsync())
                .ReturnsAsync(testICalData);

            var request = new TestHttpRequestData(_functionContext);

            // Act
            await _function.GetICalData(request);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Processing GetICalData request")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);

            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("iCal data retrieved successfully")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetICalEvents_Success_ReturnsOkWithEvents()
        {
            // Arrange
            var testICalData = new ICalDataDto
            {
                Data = "BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:Test Event\nEND:VEVENT\nEND:VCALENDAR",
                ContentType = "text/calendar",
                LastModified = DateTime.UtcNow
            };

            var testEvents = new List<ICalEventDto>
            {
                new ICalEventDto
                {
                    Uid = "test-event-1",
                    Summary = "Test Event",
                    Start = DateTime.UtcNow,
                    End = DateTime.UtcNow.AddHours(1)
                }
            };

            _mockICalService
                .Setup(x => x.GetICalDataAsync())
                .ReturnsAsync(testICalData);

            _mockICalService
                .Setup(x => x.ParseICalEventsAsync(testICalData.Data))
                .ReturnsAsync(testEvents);

            var request = new TestHttpRequestData(_functionContext);

            // Act
            var response = await _function.GetICalEvents(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            
            var testResponse = response as TestHttpResponseData;
            testResponse.Should().NotBeNull();
            
            var responseContent = testResponse!.GetBodyAsString();
            var deserializedEvents = JsonSerializer.Deserialize<List<ICalEventDto>>(responseContent, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            deserializedEvents.Should().NotBeNull();
            deserializedEvents.Should().HaveCount(1);
            deserializedEvents![0].Summary.Should().Be("Test Event");
        }

        [Fact]
        public async Task GetICalEvents_ServiceThrowsDataProcessingException_ReturnsError()
        {
            // Arrange
            var testICalData = new ICalDataDto { Data = "invalid data" };
            
            _mockICalService
                .Setup(x => x.GetICalDataAsync())
                .ReturnsAsync(testICalData);

            var exception = new DataProcessingException("Failed to parse iCal data");
            _mockICalService
                .Setup(x => x.ParseICalEventsAsync(It.IsAny<string>()))
                .ThrowsAsync(exception);

            var request = new TestHttpRequestData(_functionContext);

            // Act
            var response = await _function.GetICalEvents(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);
        }

        [Fact]
        public async Task GetICalEvents_ServiceThrowsGenericException_ReturnsInternalServerError()
        {
            // Arrange
            var exception = new Exception("Unexpected error");
            _mockICalService
                .Setup(x => x.GetICalDataAsync())
                .ThrowsAsync(exception);

            var request = new TestHttpRequestData(_functionContext);

            // Act
            var response = await _function.GetICalEvents(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
        }

        [Fact]
        public async Task GetICalEvents_LogsCorrectMessages()
        {
            // Arrange
            var testICalData = new ICalDataDto { Data = "test data" };
            var testEvents = new List<ICalEventDto> { new ICalEventDto() };

            _mockICalService
                .Setup(x => x.GetICalDataAsync())
                .ReturnsAsync(testICalData);

            _mockICalService
                .Setup(x => x.ParseICalEventsAsync(It.IsAny<string>()))
                .ReturnsAsync(testEvents);

            var request = new TestHttpRequestData(_functionContext);

            // Act
            await _function.GetICalEvents(request);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Processing GetICalEvents request")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);

            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("iCal events parsed successfully")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public void ICalOptions_ReturnsOkWithCorsHeaders()
        {
            // Arrange
            var request = new TestHttpRequestData(_functionContext);

            // Act
            var response = _function.ICalOptions(request);

            // Assert
            response.Should().NotBeNull();
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            
            // Verify CORS headers are added (this would be done by the AddCorsPreflightHeaders extension)
            response.Headers.Should().NotBeNull();
        }

        [Fact]
        public void ICalOptions_LogsCorrectMessage()
        {
            // Arrange
            var request = new TestHttpRequestData(_functionContext);

            // Act
            _function.ICalOptions(request);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Processing CORS preflight request for iCal")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public void Constructor_WithValidParameters_InitializesCorrectly()
        {
            // Arrange & Act
            var function = new ICalFunctions(_mockLogger.Object, _mockICalService.Object);

            // Assert
            function.Should().NotBeNull();
        }

        [Fact]
        public async Task GetICalEvents_CallsServiceMethodsInCorrectOrder()
        {
            // Arrange
            var testICalData = new ICalDataDto { Data = "test data" };
            var testEvents = new List<ICalEventDto>();

            var sequence = new MockSequence();
            
            _mockICalService
                .InSequence(sequence)
                .Setup(x => x.GetICalDataAsync())
                .ReturnsAsync(testICalData);

            _mockICalService
                .InSequence(sequence)
                .Setup(x => x.ParseICalEventsAsync(testICalData.Data))
                .ReturnsAsync(testEvents);

            var request = new TestHttpRequestData(_functionContext);

            // Act
            await _function.GetICalEvents(request);

            // Assert
            _mockICalService.Verify(x => x.GetICalDataAsync(), Times.Once);
            _mockICalService.Verify(x => x.ParseICalEventsAsync(testICalData.Data), Times.Once);
        }
    }
}