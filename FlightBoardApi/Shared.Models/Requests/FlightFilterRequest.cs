using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Models.Requests
{
    public class FlightFilterRequest
    {
        public string? Status { get; set; }
        public string? Destination { get; set; }
    }
}
