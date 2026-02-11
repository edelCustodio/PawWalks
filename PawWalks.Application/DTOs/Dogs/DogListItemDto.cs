namespace PawWalks.Application.DTOs.Dogs;

/// <summary>
/// DTO for displaying a dog in a list
/// </summary>
public class DogListItemDto
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public string? ClientName { get; set; }
}
