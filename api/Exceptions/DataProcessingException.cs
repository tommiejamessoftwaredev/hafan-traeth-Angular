using System.Net;

namespace HafanTraethApi.Exceptions
{
    public class DataProcessingException : HafanTraethApiException
    {
        public DataProcessingException(string message)
            : base(message, (int)HttpStatusCode.UnprocessableEntity) { }

        public DataProcessingException(string message, Exception innerException)
            : base(message, innerException, (int)HttpStatusCode.UnprocessableEntity) { }
    }
}
