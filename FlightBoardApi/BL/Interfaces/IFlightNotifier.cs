using Shared.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Interfaces
{
    public interface IFlightNotifier
    {
        Task NotifyFlightAdded(Flight flight);
        Task NotifyFlightDeleted(int flightId);
    }
}
