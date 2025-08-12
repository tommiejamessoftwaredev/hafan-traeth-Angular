namespace HafanTraethApi.DTOs
{
    public class ErrorResponseDto
    {
        public string Error { get; set; } = string.Empty;
        public string? Details { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public int StatusCode { get; set; }
    }
}
