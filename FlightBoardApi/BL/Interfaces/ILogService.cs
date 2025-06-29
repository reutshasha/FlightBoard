namespace BL.Interfaces
{
    public interface ILogService
    {
        void LogInformation(string message);
        void LogWarning(string message);
        void LogError(Exception exception, string? func);
        void LogAction(string action, string data);
    }
}
