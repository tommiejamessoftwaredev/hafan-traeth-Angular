namespace HafanTraethApi.Exceptions
{
    public abstract class HafanTraethApiException : Exception
    {
        public int StatusCode { get; }

        protected HafanTraethApiException(string message, int statusCode = 500)
            : base(message)
        {
            StatusCode = statusCode;
        }

        protected HafanTraethApiException(
            string message,
            Exception innerException,
            int statusCode = 500
        )
            : base(message, innerException)
        {
            StatusCode = statusCode;
        }
    }
}
