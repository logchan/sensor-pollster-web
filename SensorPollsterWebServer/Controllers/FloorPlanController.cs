using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Logging;
using SensorPollsterWebServer.Data;

namespace SensorPollsterWebServer.Controllers {
    [Route("api/floor-plan")]
    public sealed class FloorPlanController : ControllerBase {
        public FloorPlanController(ILogger<FloorPlanController> logger, SensorDb db) : base(logger, db) {
        }

        private IActionResult GetFile(string path, string contentType=null) {
            if (path == null || !System.IO.File.Exists(path)) {
                return NotFound();
            }

            if (contentType == null && !new FileExtensionContentTypeProvider().TryGetContentType(path, out contentType)) {
                contentType = "application/octet-stream";
            }
            return File(System.IO.File.OpenRead(path), contentType);
        }

        [HttpGet("image")]
        public IActionResult GetImage() {
            return GetFile(_config.FloorPlan?.Image);
        }

        [HttpGet("data")]
        public IActionResult GetData() {
            return GetFile(_config.FloorPlan?.Data);
        }
    }
}
