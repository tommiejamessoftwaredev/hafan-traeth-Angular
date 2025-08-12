using HafanTraethApi.Services;
using HafanTraethApi.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace HafanTraethApi.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddHafanTraethServices(this IServiceCollection services)
        {
            services.AddHttpClient<IICalService, ICalService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(30);
                client.DefaultRequestHeaders.Add("User-Agent", "HafanTraethApi/1.0");
            });

            services.AddScoped<IConfigurationService, ConfigurationService>();
            services.AddScoped<IICalService, ICalService>();

            return services;
        }
    }
}
