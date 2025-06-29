using BL.Interfaces;
using Microsoft.Extensions.Logging;

namespace BL.Services
{
    public class LogService : ILogService
    {
        private readonly ILogger<LogService> _logger;

        public LogService(ILogger<LogService> logger)
        {
            _logger = logger;
        }

        public void LogInformation(string message)
        {
            _logger.LogInformation(message);
        }

        public void LogWarning(string message)
        {
            _logger.LogWarning(message);
        }

        public void LogError(Exception exception, string? func)
        {
            _logger.LogError(exception, "Error in function: {Function}", func);
        }

        public void LogAction(string action, string data)
        {
            _logger.LogInformation("Action: {Action}, Data: {Data}", action, data);
        }
    }

}
