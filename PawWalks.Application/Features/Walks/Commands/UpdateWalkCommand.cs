using MediatR;
using PawWalks.Application.DTOs.Walks;

namespace PawWalks.Application.Features.Walks.Commands;

/// <summary>
/// Command to update an existing walk
/// </summary>
public class UpdateWalkCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
    public WalkUpdateRequest Request { get; set; } = null!;
}

