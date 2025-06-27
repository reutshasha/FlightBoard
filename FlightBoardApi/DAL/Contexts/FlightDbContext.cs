using Microsoft.EntityFrameworkCore;
using Shared.Models.Models;

namespace DAL.Contexts
{
    public class FlightDbContext : DbContext
    {
        public FlightDbContext(DbContextOptions<FlightDbContext> options) : base(options)
        {
        }

        public DbSet<Flight> Flights { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        //    modelBuilder.Entity<Flight>()
        //        .HasIndex(f => f.FlightNumber)
        //        .IsUnique();

        //    modelBuilder.Entity<Flight>()
        //        .Property(f => f.DepartureTime)
        //        .HasColumnType("datetime2");
        //}

            //modelBuilder.Entity<Flight>().ToTable("Flights");
            //modelBuilder.Entity<Flight>().HasIndex(f => f.FlightNumber).IsUnique();
            //modelBuilder.Entity<Flight>().HasKey(f => f.Id);
            //modelBuilder.Entity<Flight>().Property(f => f.FlightNumber).IsRequired();
            //modelBuilder.Entity<Flight>().Property(f => f.Destination).IsRequired();
            //modelBuilder.Entity<Flight>().Property(f => f.Gate).IsRequired();
            //modelBuilder.Entity<Flight>().Property(f => f.DepartureTime).IsRequired();
        }
    }

}
