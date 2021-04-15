using System;
using System.Linq;
using System.Net.NetworkInformation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SensorPollsterWebServer.Data;
using SensorPollsterWebServer.Model.Api;

namespace SensorPollsterWebServer.Controllers {
    [Route("api/data")]
    public class DataController : ControllerBase {
        public DataController(ILogger<DataController> logger, SensorDb db) : base(logger, db) {
        }

        [HttpGet("get")]
        public IActionResult GetData(string address, string since, string until, int limit) {
            var sensorQuery = (IQueryable<TempSensor>) _db.Sensors;
            if (address != null) {
                var macAddress = PhysicalAddress.Parse(address);
                sensorQuery = sensorQuery.Where(s => Equals(s.Address, macAddress));
            }

            var dataQuery = (IQueryable<SensorData>) _db.Data.OrderByDescending(d => d.Time);
            if (DateTime.TryParse(since, out var sinceTime)) {
                dataQuery = dataQuery.Where(d => d.Time >= sinceTime.ToUniversalTime());
            }
            if (DateTime.TryParse(until, out var untilTime)) {
                dataQuery = dataQuery.Where(d => d.Time <= untilTime.ToUniversalTime());
            }

            if (limit <= 0) {
                limit = Int32.MaxValue;
            }

            var results = from sensor in sensorQuery.ToList()
                select new Sensor {
                    Name = sensor.Name,
                    Address = sensor.Address.ToString(),
                    Data = dataQuery.Where(d => d.Device == sensor.Address).Take(limit).Select(d => new DataEntry {
                        Battery = d.Battery,
                        RSSI = d.RSSI,
                        Temperature = d.Temperature,
                        Time = d.Time
                    }).ToList()
                };
            
            return Json(results.ToList());
        }
    }
}
