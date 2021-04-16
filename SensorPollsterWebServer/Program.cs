using CommandLine;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SensorPollsterWebServer.Config;
using Serilog;
using System;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text;

namespace SensorPollsterWebServer {
    public class Program {
        public static string ServerVersion { get; private set; }
        public static HostingConfig HostingConfig { get; private set; }
        public static ServerConfig ServerConfig { get; private set; }

        public static void Main(string[] args) {
            CreateWebHostBuilder(args)?.Build()?.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) {
            IWebHostBuilder webHostBuilder = null;

            // Startup
            Console.OutputEncoding = Encoding.UTF8;
            ServerVersion = GetVersion();
            Console.WriteLine($"SensorPollsterWebServer.Server version {ServerVersion}");

            // Parse options
            var parser = new Parser(config => {
                config.AutoHelp = true;
                config.AutoVersion = false;
                config.CaseSensitive = false;
            });
            parser.ParseArguments<Options>(args).WithParsed(options => {
                // Read configuration
                var configFile = options.ConfigFile;
                if (configFile == null) {
                    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
                    configFile = Path.Combine(Directory.GetCurrentDirectory(), $"appsettings.{env}.json");
                }

                var configuration = new ConfigurationBuilder()
                    .AddJsonFile(configFile, false)
                    .Build();

                Log.Logger = new LoggerConfiguration()
                    .ReadFrom.Configuration(configuration)
                    .CreateLogger();
                Log.Information($"SensorPollsterWebServer.Server startup, version {ServerVersion}");

#if DEBUG
                Log.Warning("This is a DEBUG build. Never use it in a production environment.");
#endif

                var section = configuration.GetSection("Hosting");
                HostingConfig = section.Get<HostingConfig>();
                section = configuration.GetSection("Server");
                ServerConfig = section.Get<ServerConfig>() ?? new ServerConfig();

                InitializeServer();

                var ip = IPAddress.Loopback;
                if (!String.IsNullOrEmpty(HostingConfig.Ip)) {
                    ip = IPAddress.Parse(HostingConfig.Ip);
                }

                webHostBuilder = WebHost.CreateDefaultBuilder(args)
                    .ConfigureLogging(builder => builder.ClearProviders())
                    .UseStartup<Startup>()
                    .UseKestrel(opt => {
                        opt.Listen(ip, HostingConfig.Port);
                        opt.Limits.MaxRequestBodySize = HostingConfig.MaxRequestBodySize;
                    });
            });

            return webHostBuilder;
        }

        private static void InitializeServer() {

        }

        private static string GetVersion() {
            var asm = Assembly.GetExecutingAssembly();
            var version = asm.GetName().Version.ToString(2);
            var buildTime = File.GetLastWriteTimeUtc(asm.Location);
            return $"{version} build {buildTime:yyyyMMdd.HHmmss}";
        }

        private sealed class Options {
            [Option('c')]
            public string ConfigFile { get; set; }
        }
    }
}
