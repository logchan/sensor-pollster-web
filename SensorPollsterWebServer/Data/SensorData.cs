using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.NetworkInformation;

namespace SensorPollsterWebServer.Data {
    [Table("sensor_data")]
    public sealed class SensorData {
        [Column("device")]
        public PhysicalAddress Device { get; set; }
        [Column("timestamp")]
        public DateTime Time { get; set; }
        [Column("temperature")]
        public float Temperature { get; set; }
        [Column("battery")]
        public short Battery { get; set; }
        [Column("rssi")]
        public short RSSI { get; set; }
    }
}
