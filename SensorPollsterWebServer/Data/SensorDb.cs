using Microsoft.EntityFrameworkCore;

namespace SensorPollsterWebServer.Data {
    public class SensorDb : DbContext {
        public DbSet<SensorData> Data { get; set; }
        public DbSet<TempSensor> Sensors { get; set; }

        public SensorDb(DbContextOptions<SensorDb> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SensorData>().HasNoKey();
            modelBuilder.Entity<TempSensor>().HasNoKey();
        }
    }
}
