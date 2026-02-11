using Microsoft.AspNetCore.Mvc;

namespace PawWalks.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // Mock authentication - accepts any username/password
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Username and password are required" });
        }

        // Return a mock token
        var response = new LoginResponse
        {
            Token = $"mock-token-{Guid.NewGuid()}",
            Username = request.Username,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };

        return Ok(response);
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
