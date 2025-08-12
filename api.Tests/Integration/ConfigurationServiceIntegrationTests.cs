using FluentAssertions;
using HafanTraethApi.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace HafanTraethApi.Tests.Integration
{
    public class ConfigurationServiceIntegrationTests : IntegrationTestBase
    {
        private readonly IConfigurationService _configurationService;

        public ConfigurationServiceIntegrationTests()
        {
            _configurationService = ServiceProvider.GetRequiredService<IConfigurationService>();
        }

        [Fact]
        public async Task GetConfigurationAsync_WithoutBaseUrl_ReturnsValidConfiguration()
        {
            // Act
            var result = await _configurationService.GetConfigurationAsync();

            // Assert
            result.Should().NotBeNull();
            result.BookingComUrl.Should().NotBeNullOrEmpty();
            result.BookingComReviewsUrl.Should().NotBeNullOrEmpty();
            result.AirbnbUrl.Should().NotBeNullOrEmpty();
            result.AirbnbReviewsUrl.Should().NotBeNullOrEmpty();
            result.IcalUrl.Should().NotBeNullOrEmpty();
            result.BusRoute35PdfUrl.Should().NotBeNullOrEmpty();
            result.BusRoute36PdfUrl.Should().NotBeNullOrEmpty();
            result.BusRoute35PlannerUrl.Should().NotBeNullOrEmpty();
            result.BusRoute36PlannerUrl.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task GetConfigurationAsync_WithBaseUrl_ReturnsConfigurationWithCorrectApiUrl()
        {
            // Arrange
            const string baseUrl = "https://integration-test.example.com";

            // Act
            var result = await _configurationService.GetConfigurationAsync(baseUrl);

            // Assert
            result.Should().NotBeNull();
            result.ApiUrl.Should().Be(baseUrl);
        }

        [Fact]
        public async Task GetConfigurationAsync_MultipleCallsWithSameBaseUrl_ReturnsConsistentResults()
        {
            // Arrange
            const string baseUrl = "https://test.example.com";

            // Act
            var result1 = await _configurationService.GetConfigurationAsync(baseUrl);
            var result2 = await _configurationService.GetConfigurationAsync(baseUrl);

            // Assert
            result1.Should().BeEquivalentTo(result2);
        }

        [Theory]
        [InlineData("")]
        [InlineData("https://prod.example.com")]
        [InlineData("http://localhost:3000")]
        public async Task GetConfigurationAsync_WithVariousBaseUrls_ReturnsExpectedApiUrl(string baseUrl)
        {
            // Act
            var result = await _configurationService.GetConfigurationAsync(baseUrl);

            // Assert
            result.ApiUrl.Should().Be(baseUrl);
        }
    }
}