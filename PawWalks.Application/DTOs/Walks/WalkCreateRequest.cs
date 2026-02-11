namespace PawWalks.Application.DTOs.Walks;

/// <summary>
/// Request DTO for creating a new walk
/// </summary>
public class WalkCreateRequest
{
    public DateTimeOffset StartAt { get; set; }
    public int DurationMinutes { get; set; }
    public string? Notes { get; set; }
    public List<Guid> DogIds { get; set; } = new();
}
