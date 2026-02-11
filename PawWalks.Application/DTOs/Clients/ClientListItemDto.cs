namespace PawWalks.Application.DTOs.Clients;

/// <summary>
/// DTO for displaying a client in a list
/// </summary>
public class ClientListItemDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}
