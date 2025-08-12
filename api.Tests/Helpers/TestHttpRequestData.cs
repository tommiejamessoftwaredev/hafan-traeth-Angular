using System.Collections.Immutable;
using System.Net;
using System.Security.Claims;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;

namespace HafanTraethApi.Tests.Helpers
{
    public class TestHttpRequestData : HttpRequestData
    {
        public TestHttpRequestData(FunctionContext functionContext, Uri? uri = null, Stream? body = null) 
            : base(functionContext)
        {
            Url = uri ?? new Uri("https://localhost/test");
            Body = body ?? new MemoryStream();
            Headers = new HttpHeadersCollection();
            Cookies = new List<IHttpCookie>();
            Identities = new List<ClaimsIdentity>();
            Method = "GET";
        }

        public override Stream Body { get; }
        public override HttpHeadersCollection Headers { get; }
        public override IReadOnlyCollection<IHttpCookie> Cookies { get; }
        public override Uri Url { get; }
        public override IEnumerable<ClaimsIdentity> Identities { get; }
        public override string Method { get; }

        public override HttpResponseData CreateResponse()
        {
            return new TestHttpResponseData(FunctionContext);
        }
    }

    public class TestHttpResponseData : HttpResponseData
    {
        private readonly MemoryStream _bodyStream;
        private readonly HttpHeadersCollection _headers;

        public TestHttpResponseData(FunctionContext functionContext) : base(functionContext)
        {
            _bodyStream = new MemoryStream();
            _headers = new HttpHeadersCollection();
        }

        public override HttpStatusCode StatusCode { get; set; }
        public override HttpHeadersCollection Headers 
        { 
            get => _headers; 
            set { } 
        }
        public override Stream Body 
        { 
            get => _bodyStream; 
            set { } 
        }
        public override HttpCookies Cookies => Mock.Of<HttpCookies>();

        public string GetBodyAsString()
        {
            _bodyStream.Position = 0;
            using var reader = new StreamReader(_bodyStream);
            return reader.ReadToEnd();
        }
    }

    public class TestFunctionContext : FunctionContext
    {
        public TestFunctionContext()
        {
            var services = new ServiceCollection();
            services.AddLogging();
            InstanceServices = services.BuildServiceProvider();
        }

        public override string InvocationId => Guid.NewGuid().ToString();
        public override string FunctionId => "TestFunction";
        public override TraceContext TraceContext => Mock.Of<TraceContext>();
        public override BindingContext BindingContext => Mock.Of<BindingContext>();
        public override RetryContext RetryContext => Mock.Of<RetryContext>();
        public override IServiceProvider InstanceServices { get; set; }
        public override FunctionDefinition FunctionDefinition => Mock.Of<FunctionDefinition>();
        public override IDictionary<object, object> Items { get; set; } = new Dictionary<object, object>();
        public override IInvocationFeatures Features => Mock.Of<IInvocationFeatures>();
    }
}