using FluentAssertions;
using HafanTraethApi.DTOs;
using HafanTraethApi.Exceptions;
using HafanTraethApi.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using System.Net;
using System.Text;
using Xunit;

namespace HafanTraethApi.Tests.Services
{
    public class ICalServiceTests
    {
        private readonly Mock<ILogger<ICalService>> _mockLogger;
        private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
        private readonly HttpClient _httpClient;
        private readonly ICalService _service;

        public ICalServiceTests()
        {
            _mockLogger = new Mock<ILogger<ICalService>>();
            _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
            _httpClient = new HttpClient(_mockHttpMessageHandler.Object);
            _service = new ICalService(_mockLogger.Object, _httpClient);
        }

        [Fact]
        public async Task GetICalDataAsync_WithUrl_ReturnsICalData()
        {
            // Arrange
            const string testUrl = "https://example.com/ical";
            const string testICalData = "BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR";
            
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(testICalData, Encoding.UTF8, "text/calendar")
            };

            _mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(response);

            // Act
            var result = await _service.GetICalDataAsync(testUrl);

            // Assert
            result.Should().NotBeNull();
            result.Data.Should().Be(testICalData);
            result.ContentType.Should().Be("text/calendar");
            result.LastModified.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        }

        [Fact]
        public async Task GetICalDataAsync_WithUrl_LogsCorrectMessages()
        {
            // Arrange
            const string testUrl = "https://example.com/ical";
            const string testICalData = "BEGIN:VCALENDAR\nEND:VCALENDAR";
            
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(testICalData)
            };

            _mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(response);

            // Act
            await _service.GetICalDataAsync(testUrl);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Fetching iCal data from")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);

            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Successfully retrieved iCal data")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task GetICalDataAsync_HttpRequestException_ThrowsExternalServiceException()
        {
            // Arrange
            const string testUrl = "https://example.com/ical";
            
            _mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ThrowsAsync(new HttpRequestException("Network error"));

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ExternalServiceException>(
                () => _service.GetICalDataAsync(testUrl));
            
            exception.Message.Should().Contain("Failed to fetch iCal data");
            exception.InnerException.Should().BeOfType<HttpRequestException>();
        }

        [Fact]
        public async Task GetICalDataAsync_TaskCanceledException_ThrowsExternalServiceException()
        {
            // Arrange
            const string testUrl = "https://example.com/ical";
            
            _mockHttpMessageHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ThrowsAsync(new TaskCanceledException("Timeout"));

            // Act & Assert
            var exception = await Assert.ThrowsAsync<ExternalServiceException>(
                () => _service.GetICalDataAsync(testUrl));
            
            exception.Message.Should().Contain("Timeout while fetching iCal data");
            exception.InnerException.Should().BeOfType<TaskCanceledException>();
        }

        [Fact]
        public async Task ParseICalEventsAsync_ValidICalData_ReturnsEvents()
        {
            // Arrange
            const string testICalData = @"BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
UID:test-event-1
DTSTART:20240101T120000Z
DTEND:20240101T130000Z
SUMMARY:Test Event 1
DESCRIPTION:This is a test event
END:VEVENT
BEGIN:VEVENT
UID:test-event-2
DTSTART:20240102T140000Z
DTEND:20240102T150000Z
SUMMARY:Test Event 2
DESCRIPTION:Another test event
END:VEVENT
END:VCALENDAR";

            // Act
            var result = await _service.ParseICalEventsAsync(testICalData);

            // Assert
            result.Should().HaveCount(2);
            
            var firstEvent = result[0];
            firstEvent.Uid.Should().Be("test-event-1");
            firstEvent.Summary.Should().Be("Test Event 1");
            firstEvent.Description.Should().Be("This is a test event");
            firstEvent.Start.Should().Be(new DateTime(2024, 1, 1, 12, 0, 0, DateTimeKind.Utc));
            firstEvent.End.Should().Be(new DateTime(2024, 1, 1, 13, 0, 0, DateTimeKind.Utc));
            
            var secondEvent = result[1];
            secondEvent.Uid.Should().Be("test-event-2");
            secondEvent.Summary.Should().Be("Test Event 2");
            secondEvent.Description.Should().Be("Another test event");
        }

        [Fact]
        public async Task ParseICalEventsAsync_EmptyData_ReturnsEmptyList()
        {
            // Arrange
            const string testICalData = @"BEGIN:VCALENDAR
VERSION:2.0
END:VCALENDAR";

            // Act
            var result = await _service.ParseICalEventsAsync(testICalData);

            // Assert
            result.Should().BeEmpty();
        }

        [Fact]
        public async Task ParseICalEventsAsync_WithEscapedText_UnescapesCorrectly()
        {
            // Arrange
            const string testICalData = @"BEGIN:VCALENDAR
BEGIN:VEVENT
UID:test-event
SUMMARY:Test\, Event
DESCRIPTION:Line 1\nLine 2\; with semicolon\\ and backslash
END:VEVENT
END:VCALENDAR";

            // Act
            var result = await _service.ParseICalEventsAsync(testICalData);

            // Assert
            result.Should().HaveCount(1);
            result[0].Summary.Should().Be("Test, Event");
            result[0].Description.Should().Be("Line 1\nLine 2; with semicolon\\ and backslash");
        }

        [Fact]
        public async Task ParseICalEventsAsync_WithDateOnly_ParsesCorrectly()
        {
            // Arrange
            const string testICalData = @"BEGIN:VCALENDAR
BEGIN:VEVENT
UID:test-event
DTSTART:20240101
DTEND:20240102
SUMMARY:All Day Event
END:VEVENT
END:VCALENDAR";

            // Act
            var result = await _service.ParseICalEventsAsync(testICalData);

            // Assert
            result.Should().HaveCount(1);
            result[0].Start.Should().Be(new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc));
            result[0].End.Should().Be(new DateTime(2024, 1, 2, 0, 0, 0, DateTimeKind.Utc));
        }

        [Fact]
        public async Task ParseICalEventsAsync_InvalidDateTime_UsesMinValue()
        {
            // Arrange
            const string testICalData = @"BEGIN:VCALENDAR
BEGIN:VEVENT
UID:test-event
DTSTART:invalid-date
SUMMARY:Test Event
END:VEVENT
END:VCALENDAR";

            // Act
            var result = await _service.ParseICalEventsAsync(testICalData);

            // Assert
            result.Should().HaveCount(1);
            result[0].Start.Should().Be(DateTime.MinValue);
        }

        [Fact]
        public async Task ParseICalEventsAsync_ExceptionDuringParsing_ThrowsDataProcessingException()
        {
            // Arrange
            const string invalidICalData = null!;

            // Act & Assert
            var exception = await Assert.ThrowsAsync<DataProcessingException>(
                () => _service.ParseICalEventsAsync(invalidICalData));
            
            exception.Message.Should().Be("Failed to parse iCal data");
            exception.InnerException.Should().NotBeNull();
        }

        [Fact]
        public async Task ParseICalEventsAsync_LogsCorrectMessages()
        {
            // Arrange
            const string testICalData = @"BEGIN:VCALENDAR
BEGIN:VEVENT
UID:test-event
SUMMARY:Test Event
END:VEVENT
END:VCALENDAR";

            // Act
            await _service.ParseICalEventsAsync(testICalData);

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Parsing iCal events")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);

            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Successfully parsed") && v.ToString()!.Contains("iCal events")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public void Constructor_WithValidParameters_InitializesCorrectly()
        {
            // Arrange & Act
            var service = new ICalService(_mockLogger.Object, _httpClient);

            // Assert
            service.Should().NotBeNull();
        }
    }
}