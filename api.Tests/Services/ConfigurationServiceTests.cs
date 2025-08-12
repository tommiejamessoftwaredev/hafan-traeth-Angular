using FluentAssertions;
using HafanTraethApi.DTOs;
using HafanTraethApi.Exceptions;
using HafanTraethApi.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace HafanTraethApi.Tests.Services
{
    public class ConfigurationServiceTests
    {
        private readonly Mock<ILogger<ConfigurationService>> _mockLogger;
        private readonly ConfigurationService _service;

        public ConfigurationServiceTests()
        {
            _mockLogger = new Mock<ILogger<ConfigurationService>>();
            _service = new ConfigurationService(_mockLogger.Object);
        }

        [Fact]
        public async Task GetConfigurationAsync_WithoutBaseUrl_ReturnsConfigurationWithDefaults()
        {
            // Act
            var result = await _service.GetConfigurationAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().BeOfType<ConfigurationDto>();
            result.ApiUrl.Should().Be("");
            result.BookingComUrl.Should().Be("https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html");
            result.BookingComReviewsUrl.Should().Be("https://www.booking.com/hotel/gb/hafan-traeth.en-gb.html#tab-reviews");
            result.AirbnbUrl.Should().Be("https://www.airbnb.co.uk/rooms/920441523710400719");
            result.AirbnbReviewsUrl.Should().Be("https://www.airbnb.co.uk/rooms/920441523710400719/reviews");
            result.IcalUrl.Should().Be("https://ical.booking.com/v1/export?t=32f37ade-b2ed-48b9-9e49-573b6dcc4660");
            result.BusRoute35PdfUrl.Should().Be("/36-Rhyl-Circular-from-26-Jan-2025.pdf");
            result.BusRoute36PdfUrl.Should().Be("/35-Rhyl-Circular-from-26-Jan-2025.pdf");
            result.BusRoute35PlannerUrl.Should().Be("https://www.arrivabus.co.uk/find-a-service/35-rhyl-circular");
            result.BusRoute36PlannerUrl.Should().Be("https://www.arrivabus.co.uk/find-a-service/36-rhyl-circular");
        }

        [Fact]
        public async Task GetConfigurationAsync_WithBaseUrl_ReturnsConfigurationWithProvidedBaseUrl()
        {
            // Arrange
            const string baseUrl = "https://api.example.com";

            // Act
            var result = await _service.GetConfigurationAsync(baseUrl);

            // Assert
            result.Should().NotBeNull();
            result.ApiUrl.Should().Be(baseUrl);
        }

        [Theory]
        [InlineData("")]
        [InlineData("https://custom.api.com")]
        [InlineData("http://localhost:3000")]
        public async Task GetConfigurationAsync_WithVariousBaseUrls_ReturnsCorrectApiUrl(string baseUrl)
        {
            // Act
            var result = await _service.GetConfigurationAsync(baseUrl);

            // Assert
            result.ApiUrl.Should().Be(baseUrl);
        }

        [Fact]
        public async Task GetConfigurationAsync_LogsInformationMessages()
        {
            // Act
            await _service.GetConfigurationAsync();

            // Assert
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Retrieving application configuration")),
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
        public async Task GetConfigurationAsync_WhenSuccessful_ReturnsCompletedTask()
        {
            // Act
            var task = _service.GetConfigurationAsync();
            var result = await task;

            // Assert
            task.IsCompleted.Should().BeTrue();
            result.Should().NotBeNull();
        }

        [Fact]
        public void ConfigurationService_Constructor_InitializesCorrectly()
        {
            // Arrange & Act
            var service = new ConfigurationService(_mockLogger.Object);

            // Assert
            service.Should().NotBeNull();
        }

        [Fact]
        public async Task GetConfigurationAsync_OverloadWithoutParameter_CallsOverloadWithNullParameter()
        {
            // Act
            var result1 = await _service.GetConfigurationAsync();
            var result2 = await _service.GetConfigurationAsync(null);

            // Assert
            result1.Should().BeEquivalentTo(result2);
        }
    }
}