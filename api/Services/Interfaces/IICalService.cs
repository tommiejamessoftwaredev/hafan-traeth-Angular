using HafanTraethApi.DTOs;

namespace HafanTraethApi.Services.Interfaces
{
    public interface IICalService
    {
        Task<ICalDataDto> GetICalDataAsync();
        Task<ICalDataDto> GetICalDataAsync(string icalUrl);
        Task<List<ICalEventDto>> ParseICalEventsAsync(string icalData);
    }
}
