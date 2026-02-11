using PawWalks.Domain.Enums;

namespace PawWalks.Application.DTOs.Walks;

/// <summary>
/// Request DTO for updating an existing walk
/// </summary>
public class WalkUpdateRequest
{
    public DateTimeOffset StartAt { get; set; }
    public int DurationMinutes { get; set; }
    public string? Notes { get; set; }
    public WalkStatus Status { get; set; }
    public List<Guid> DogIds { get; set; } = new();
}
