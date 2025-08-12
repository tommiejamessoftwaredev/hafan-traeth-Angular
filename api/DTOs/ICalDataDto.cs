namespace HafanTraethApi.DTOs
{
    public class ICalDataDto
    {
        public string Data { get; set; } = string.Empty;
        public DateTime LastModified { get; set; }
        public string ContentType { get; set; } = "text/calendar";
    }

    public class ICalEventDto
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string Summary { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Uid { get; set; } = string.Empty;
    }
}
