using PawWalks.Domain.Common;
using PawWalks.Domain.Enums;

namespace PawWalks.Domain.Entities;

/// <summary>
/// Represents a scheduled or completed dog walking event
/// </summary>
public class WalkEvent : BaseEntity
{
    public DateTimeOffset StartAt { get; set; }
    public int DurationMinutes { get; set; }
    public string? Notes { get; set; }
    public WalkStatus Status { get; set; } = WalkStatus.Scheduled;

    // Navigation properties
    public ICollection<WalkEventDog> WalkEventDogs { get; set; } = new List<WalkEventDog>();
}
