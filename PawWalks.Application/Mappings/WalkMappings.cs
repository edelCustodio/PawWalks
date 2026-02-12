using Microsoft.EntityFrameworkCore;
using PawWalks.Application.DTOs.Walks;
using PawWalks.Domain.Entities;
using PawWalks.Domain.Enums;

namespace PawWalks.Application.Mappings;

/// <summary>
/// Extension methods for mapping between WalkEvent entity and DTOs
/// </summary>
public static class WalkMappings
{
    public static WalkListItemDto ToListItemDto(this WalkEvent walk)
    {
        return new WalkListItemDto
        {
            Id = walk.Id,
            StartAt = walk.StartAt,
            DurationMinutes = walk.DurationMinutes,
            Status = walk.Status,
            DogCount = walk.WalkEventDogs?.Count ?? 0
        };
    }

    public static WalkDetailDto ToDetailDto(this WalkEvent walk)
    {
        return new WalkDetailDto
        {
            Id = walk.Id,
            StartAt = walk.StartAt,
            DurationMinutes = walk.DurationMinutes,
            Notes = walk.Notes,
            Status = walk.Status,
            CreatedAt = walk.CreatedAt,
            UpdatedAt = walk.UpdatedAt,
            Dogs = walk.WalkEventDogs?
                .Select(wed => wed.Dog.ToDetailDto())
                .ToList() ?? new()
        };
    }

    public static WalkEvent ToEntity(this WalkCreateRequest request)
    {
        return new WalkEvent
        {
            StartAt = request.StartAt.ToUniversalTime(),
            DurationMinutes = request.DurationMinutes,
            Notes = request.Notes,
            Status = WalkStatus.Scheduled
        };
    }

    public static void UpdateEntity(this WalkUpdateRequest request, WalkEvent walk)
    {
        walk.StartAt = request.StartAt.ToUniversalTime();
        walk.DurationMinutes = request.DurationMinutes;
        walk.Notes = request.Notes;
        walk.Status = request.Status;
    }
}
