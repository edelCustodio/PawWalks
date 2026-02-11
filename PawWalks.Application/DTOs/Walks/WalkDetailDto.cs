using PawWalks.Application.DTOs.Dogs;
using PawWalks.Domain.Enums;

namespace PawWalks.Application.DTOs.Walks;

/// <summary>
/// DTO for displaying detailed walk information including dogs
/// </summary>
public class WalkDetailDto
{
    public Guid Id { get; set; }
    public DateTimeOffset StartAt { get; set; }
    public int DurationMinutes { get; set; }
    public string? Notes { get; set; }
    public WalkStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<DogListItemDto> Dogs { get; set; } = new();
}
