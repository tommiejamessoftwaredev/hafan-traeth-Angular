using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using HafanTraethApi.Services.Interfaces;
using HafanTraethApi.Services;
using Microsoft.Azure.Functions.Worker;
using Xunit;

namespace HafanTraethApi.Tests.Integration
{
    public abstract class IntegrationTestBase : IDisposable
    {
        protected readonly IServiceProvider ServiceProvider;
        private readonly IHost _host;

        protected IntegrationTestBase()
        {
            var builder = new HostBuilder()
                .ConfigureServices(services =>
                {
                    services.AddLogging(builder => builder.AddConsole());
                    services.AddHttpClient();
                    services.AddScoped<IConfigurationService, ConfigurationService>();
                    services.AddScoped<IICalService, ICalService>();
                });

            _host = builder.Build();
            ServiceProvider = _host.Services;
        }

        public void Dispose()
        {
            _host?.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}