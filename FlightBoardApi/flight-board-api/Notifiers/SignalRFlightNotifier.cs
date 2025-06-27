using Microsoft.AspNetCore.SignalR;
using BL.Interfaces;
using FlightBoardApi.Hubs;
using Shared.Models.Models;
namespace FlightBoardApi.Notifiers
{
    public class SignalRFlightNotifier : IFlightNotifier
    {
        private readonly IHubContext<FlightHub> _hubContext;

        public SignalRFlightNotifier(IHubContext<FlightHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyFlightAdded(Flight flight)
        {
            await _hubContext.Clients.All.SendAsync("FlightAdded", flight);
        }

        public async Task NotifyFlightDeleted(int flightId)
        {
            await _hubContext.Clients.All.SendAsync("FlightDeleted", flightId);
        }
    }
}
