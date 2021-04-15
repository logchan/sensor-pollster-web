using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SensorPollsterWebServer.Config;
using System.Security.Claims;
using SensorPollsterWebServer.Data;

namespace SensorPollsterWebServer.Controllers {
    public abstract class ControllerBase : Controller {
        protected readonly ILogger _logger;
        protected readonly SensorDb _db;
        protected readonly ServerConfig _config = Program.ServerConfig;
        protected string _username;

        protected ControllerBase(ILogger logger, SensorDb db) {
            _logger = logger;
            _db = db;
        }

        internal bool ProcessUser() {
            if (!User.Identity.IsAuthenticated) {
                return false;
            }

            var username = User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (!_config.AllowedUsers.Contains(username)) {
                return false;
            }

            _username = username;
            return true;
        }
    }
}
