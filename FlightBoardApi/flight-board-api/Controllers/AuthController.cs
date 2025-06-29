using BL.DTOs;
using BL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace FlightBoardApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiVersion("1.0")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthManager _authManager;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthManager authManager, ILogger<AuthController> logger)
        {
            _authManager = authManager;
            _logger = logger;
        }

        /// <summary>
        /// Handles user login and returns a JWT token if authentication is successful.
        /// </summary>
        /// <param name="loginDto">The login request containing the username and password.</param>
        /// <returns>Returns an HTTP status with a token if authentication is successful, or an error message if authentication fails.</returns>
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return _authManager.Authenticate(loginDto.Username, loginDto.Password) is string token
                ? Ok(new { Token = token })
                : Unauthorized(new { Error = "Invalid username or password." });
        }

    }

}


