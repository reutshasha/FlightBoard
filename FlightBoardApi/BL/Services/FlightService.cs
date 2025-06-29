using BL.Interfaces;
using DAL.Contexts;
using Microsoft.EntityFrameworkCore;
using Shared.Models.Models;
using Shared.Models.response;
using System.Net;

namespace BL.Services
{
    public class FlightService : IFlightService
    {
        private readonly FlightDbContext _context;
        private readonly IFlightNotifier _notifier;
        public FlightService(FlightDbContext context, IFlightNotifier notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        public Response<List<Flight>> GetFlights(string? status = null, string? destination = null)
        {
            var flights = _context.Flights.ToList();

            if (!string.IsNullOrWhiteSpace(destination))
            {
                flights = flights.Where(f => f.Destination.Contains(destination, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                flights = flights.Where(f =>
                {
                    var calcStatus = GetFlightStatus(f.DepartureTime);
                    return calcStatus.Equals(status, StringComparison.OrdinalIgnoreCase);
                }).ToList();
            }

            return new Response<List<Flight>>(HttpStatusCode.OK, "Flights retrieved.", flights);
        }

        private string GetFlightStatus(DateTime departureTime)
        {
            var now = DateTime.UtcNow;
            var diff = (departureTime - now).TotalMinutes;


            if (diff > 30) return "Scheduled";
            if (diff > 10) return "Boarding";
            if (diff < -60) return "Landed";
            if (diff < -15) return "Delayed";
            if (diff >= -60) return "Departed";
            return "Scheduled";
        }

        public async Task<Response<Flight>> AddFlight(Flight flight)
        {
            if (await _context.Flights.AnyAsync(f => f.FlightNumber == flight.FlightNumber))
            {
                return new Response<Flight>(HttpStatusCode.Conflict, "Flight number already exists.");
            }

            if (flight.DepartureTime <= DateTime.Now)
            {
                return new Response<Flight>(HttpStatusCode.BadRequest, "Departure time must be in the future.");
            }

            _context.Flights.Add(flight);
            _context.SaveChangesAsync();

            await _notifier.NotifyFlightAdded(flight);

            return new Response<Flight>(HttpStatusCode.Created, "Flight added successfully.", flight);
        }

        public async Task<Response<bool>> DeleteFlight(int id)
        {
            var flight = await _context.Flights.FindAsync(id);

            if (flight == null)
            {
                return new Response<bool>(HttpStatusCode.NotFound, "Flight not found.", false);
            }

            _context.Flights.Remove(flight);
            _context.SaveChangesAsync();

            await _notifier.NotifyFlightDeleted(id);
            return new Response<bool>(HttpStatusCode.OK, "Flight deleted successfully.", true);
        }
    }
}
