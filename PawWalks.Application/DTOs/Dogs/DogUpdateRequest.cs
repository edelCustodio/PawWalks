namespace PawWalks.Application.DTOs.Dogs;

/// <summary>
/// Request DTO for updating an existing dog
/// </summary>
public class DogUpdateRequest
{
    public Guid ClientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public DateOnly? BirthDate { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
}
