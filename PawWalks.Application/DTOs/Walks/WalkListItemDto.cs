using PawWalks.Domain.Enums;

namespace PawWalks.Application.DTOs.Walks;

/// <summary>
/// DTO for displaying a walk in a list
/// </summary>
public class WalkListItemDto
{
    public Guid Id { get; set; }
    public DateTimeOffset StartAt { get; set; }
    public int DurationMinutes { get; set; }
    public WalkStatus Status { get; set; }
    public int DogCount { get; set; }
}
