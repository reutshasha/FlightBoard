using BL.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.Models;

namespace FlightBoardApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiVersion("1.0")]
    public class FlightsController : Controller
    {
        private readonly IFlightService _flightService;
        public FlightsController(IFlightService flightService)
        {
            _flightService = flightService;
        }

        /// <summary>
        /// Retrieves all flights, with optional filters.
        /// </summary>
        [HttpGet]
        public IActionResult Get([FromQuery] string? status, [FromQuery] string? destination)
        {
            var response = _flightService.GetFlights(status, destination);

            return StatusCode((int)response.StatusCode, new
            {
                message = response.Message,
                data = response.Data
            });
        }

        /// <summary>
        /// Adds a new flight to the system.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Flight flight)
        {
            var response = await _flightService.AddFlight(flight);
            return StatusCode((int)response.StatusCode, new
            {
                message = response.Message,
                data = response.Data
            });
        }

        /// <summary>
        /// Deletes a flight by its ID.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _flightService.DeleteFlight(id);

            return StatusCode((int)response.StatusCode, new
            {
                message = response.Message,
                data = response.Data
            });
        }
    }
}
