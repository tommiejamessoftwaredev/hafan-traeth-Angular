using HafanTraethApi.DTOs;

namespace HafanTraethApi.Services.Interfaces
{
    public interface IConfigurationService
    {
        Task<ConfigurationDto> GetConfigurationAsync();
        Task<ConfigurationDto> GetConfigurationAsync(string? baseUrl);
    }
}
