using System.Collections.Generic;

namespace SensorPollsterWebServer.Model.Api.Data {
    public sealed class GetDataResponse {
        public List<Sensor> Sensors { get; set; }
    }
}
