using System.Collections.Generic;

namespace SensorPollsterWebServer.Model.Api {
    public sealed class Sensor {
        public string Name { get; set; }
        public string Address { get; set; }
        public List<DataEntry> Data { get; set; }
    }
}
