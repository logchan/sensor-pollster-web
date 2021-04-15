using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SensorPollsterWebServer.Data;
using SensorPollsterWebServer.Framework;
using SensorPollsterWebServer.Model.Api.User;

namespace SensorPollsterWebServer.Controllers {
    [Route("api/user")]
    public sealed class UserController: ControllerBase {
        public UserController(ILogger<UserController> logger, SensorDb db) : base(logger, db) {

        }

        [HttpGet("client_challenge")]
        public IActionResult ClientChallenge(string redirect="/") {
            return Challenge(new AuthenticationProperties {
                RedirectUri = redirect
            });
        }

        [HttpGet("auth")]
        public IActionResult Auth() {
            return Json(new AuthResponse(User.Identity.IsAuthenticated, Url.Action("ClientChallenge")));
        }

        [RequireUser]
        [HttpGet("info")]
        public IActionResult Info() {
            return Json(_username);
        }

        [RequireUser]
        [HttpGet("logout")]
        public async Task<IActionResult> Logout() {
            await HttpContext.SignOutAsync();
            return StatusCode(200);
        }
    }
}
