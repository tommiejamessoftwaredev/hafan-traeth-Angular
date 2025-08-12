using System.Text;
using System.Text.RegularExpressions;
using HafanTraethApi.DTOs;
using HafanTraethApi.Exceptions;
using HafanTraethApi.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace HafanTraethApi.Services
{
    public class ICalService : IICalService
    {
        private readonly ILogger<ICalService> _logger;
        private readonly HttpClient _httpClient;

        public ICalService(ILogger<ICalService> logger, HttpClient httpClient)
        {
            _logger = logger;
            _httpClient = httpClient;
        }

        public async Task<ICalDataDto> GetICalDataAsync()
        {
            var icalUrl =
                Environment.GetEnvironmentVariable("ICAL_URL")
                ?? throw new ConfigurationException(
                    "ICAL_URL environment variable is not configured"
                );

            return await GetICalDataAsync(icalUrl);
        }

        public async Task<ICalDataDto> GetICalDataAsync(string icalUrl)
        {
            _logger.LogInformation("Fetching iCal data from {ICalUrl}", icalUrl);

            try
            {
                var response = await _httpClient.GetAsync(icalUrl);
                response.EnsureSuccessStatusCode();

                var icalData = await response.Content.ReadAsStringAsync();

                var result = new ICalDataDto
                {
                    Data = icalData,
                    LastModified = DateTime.UtcNow,
                    ContentType =
                        response.Content.Headers.ContentType?.MediaType ?? "text/calendar",
                };

                _logger.LogInformation(
                    "Successfully retrieved iCal data ({DataSize} bytes)",
                    Encoding.UTF8.GetByteCount(icalData)
                );

                return result;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error while fetching iCal data from {ICalUrl}", icalUrl);
                throw new ExternalServiceException($"Failed to fetch iCal data from {icalUrl}", ex);
            }
            catch (TaskCanceledException ex)
            {
                _logger.LogError(ex, "Timeout while fetching iCal data from {ICalUrl}", icalUrl);
                throw new ExternalServiceException(
                    $"Timeout while fetching iCal data from {icalUrl}",
                    ex
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Unexpected error while fetching iCal data from {ICalUrl}",
                    icalUrl
                );
                throw new ExternalServiceException(
                    $"Unexpected error while fetching iCal data from {icalUrl}",
                    ex
                );
            }
        }

        public Task<List<ICalEventDto>> ParseICalEventsAsync(string icalData)
        {
            _logger.LogInformation("Parsing iCal events");

            try
            {
                var events = new List<ICalEventDto>();
                var lines = icalData.Split('\n', StringSplitOptions.RemoveEmptyEntries);

                ICalEventDto? currentEvent = null;
                var currentProperty = new StringBuilder();

                foreach (var rawLine in lines)
                {
                    var line = rawLine.Trim();

                    if (line.StartsWith(" ") || line.StartsWith("\t"))
                    {
                        currentProperty.Append(line.Substring(1));
                        continue;
                    }

                    if (currentProperty.Length > 0)
                    {
                        ProcessICalProperty(currentProperty.ToString(), ref currentEvent, events);
                        currentProperty.Clear();
                    }

                    currentProperty.Append(line);
                }
                if (currentProperty.Length > 0)
                {
                    ProcessICalProperty(currentProperty.ToString(), ref currentEvent, events);
                }

                _logger.LogInformation(
                    "Successfully parsed {EventCount} iCal events",
                    events.Count
                );
                return Task.FromResult(events);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error parsing iCal data");
                throw new DataProcessingException("Failed to parse iCal data", ex);
            }
        }

        private void ProcessICalProperty(
            string property,
            ref ICalEventDto? currentEvent,
            List<ICalEventDto> events
        )
        {
            if (property.StartsWith("BEGIN:VEVENT"))
            {
                currentEvent = new ICalEventDto();
            }
            else if (property.StartsWith("END:VEVENT") && currentEvent != null)
            {
                events.Add(currentEvent);
                currentEvent = null;
            }
            else if (currentEvent != null)
            {
                var colonIndex = property.IndexOf(':');
                if (colonIndex > 0)
                {
                    var propertyName = property.Substring(0, colonIndex);
                    var propertyValue = property.Substring(colonIndex + 1);

                    // Remove parameters (everything after semicolon in property name)
                    var semicolonIndex = propertyName.IndexOf(';');
                    if (semicolonIndex > 0)
                    {
                        propertyName = propertyName.Substring(0, semicolonIndex);
                    }

                    switch (propertyName.ToUpper())
                    {
                        case "DTSTART":
                            currentEvent.Start = ParseICalDateTime(propertyValue);
                            break;
                        case "DTEND":
                            currentEvent.End = ParseICalDateTime(propertyValue);
                            break;
                        case "SUMMARY":
                            currentEvent.Summary = UnescapeICalText(propertyValue);
                            break;
                        case "DESCRIPTION":
                            currentEvent.Description = UnescapeICalText(propertyValue);
                            break;
                        case "UID":
                            currentEvent.Uid = propertyValue;
                            break;
                    }
                }
            }
        }

        private DateTime ParseICalDateTime(string dateTimeStr)
        {
            dateTimeStr = Regex.Replace(dateTimeStr, @"[;:].*$", "");

            if (
                DateTime.TryParseExact(
                    dateTimeStr,
                    "yyyyMMddTHHmmssZ",
                    null,
                    System.Globalization.DateTimeStyles.AssumeUniversal,
                    out DateTime result
                )
            )
            {
                return result;
            }

            if (
                DateTime.TryParseExact(
                    dateTimeStr,
                    "yyyyMMdd",
                    null,
                    System.Globalization.DateTimeStyles.AssumeUniversal,
                    out result
                )
            )
            {
                return result;
            }

            _logger.LogWarning("Could not parse iCal datetime: {DateTime}", dateTimeStr);
            return DateTime.MinValue;
        }

        private string UnescapeICalText(string text)
        {
            return text.Replace("\\n", "\n")
                .Replace("\\,", ",")
                .Replace("\\;", ";")
                .Replace("\\\\", "\\");
        }
    }
}
