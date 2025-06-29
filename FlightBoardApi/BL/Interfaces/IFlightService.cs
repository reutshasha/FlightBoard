using Shared.Models.Models;
using Shared.Models.response;

namespace BL.Interfaces
{
    public interface IFlightService
    {
        Response<List<Flight>> GetFlights(string? status = null, string? destination = null);
        Task<Response<Flight>> AddFlight(Flight flight);
        Task<Response<bool>> DeleteFlight(int id);
    }
}
