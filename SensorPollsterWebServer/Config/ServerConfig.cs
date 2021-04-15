using System.Collections.Generic;

namespace SensorPollsterWebServer.Config {
    public sealed class ServerConfig {
        public string StaticFiles { get; set; }
        public string ConnectionString { get; set; }
        public OAuthConfig OAuth { get; set; }
        public List<string> AllowedUsers { get; set; } = new List<string>();
        public FloorPlanConfig FloorPlan { get; set; }
    }
}
