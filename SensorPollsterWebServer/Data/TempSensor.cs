using System.ComponentModel.DataAnnotations.Schema;
using System.Net.NetworkInformation;

namespace SensorPollsterWebServer.Data {
    [Table("temp_sensors")]
    public sealed class TempSensor {
        [Column("name")]
        public string Name { get; set; }
        [Column("address")]
        public PhysicalAddress Address { get; set; }
    }
}
