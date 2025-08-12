using System.Net;

namespace HafanTraethApi.Exceptions
{
    public class ConfigurationException : HafanTraethApiException
    {
        public ConfigurationException(string message)
            : base(message, (int)HttpStatusCode.InternalServerError) { }

        public ConfigurationException(string message, Exception innerException)
            : base(message, innerException, (int)HttpStatusCode.InternalServerError) { }
    }
}
