using System.Net;

namespace HafanTraethApi.Exceptions
{
    public class ExternalServiceException : HafanTraethApiException
    {
        public ExternalServiceException(string message)
            : base(message, (int)HttpStatusCode.ServiceUnavailable) { }

        public ExternalServiceException(string message, Exception innerException)
            : base(message, innerException, (int)HttpStatusCode.ServiceUnavailable) { }
    }
}
