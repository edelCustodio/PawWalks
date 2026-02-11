namespace PawWalks.Application.DTOs.Dogs;

/// <summary>
/// DTO for displaying detailed dog information
/// </summary>
public class DogDetailDto
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public DateOnly? BirthDate { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? ClientName { get; set; }
}
