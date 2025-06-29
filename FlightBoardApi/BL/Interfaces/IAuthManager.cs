namespace BL.Interfaces
{
    public interface IAuthManager
    {
        string Authenticate(string username, string password);
        string GenerateJwtToken(string username, string userId);
        Task<bool> ValidateToken(string token);
    }
}
