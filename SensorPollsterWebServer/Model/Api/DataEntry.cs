using System;

namespace SensorPollsterWebServer.Model.Api {
    public sealed class DataEntry {
        public DateTime Time { get; set; }
        public float Temperature { get; set; }
        public short Battery { get; set; }
        public short RSSI { get; set; }
    }
}
