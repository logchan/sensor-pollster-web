
namespace SensorPollsterWebServer.Config {
    public class HostingConfig {
        public string Ip { get; set; }
        public int Port { get; set; }
        public long MaxRequestBodySize { get; set; } = 1 << 31; // Default 2GB
    }
}
