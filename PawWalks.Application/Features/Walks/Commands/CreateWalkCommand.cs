using MediatR;
using PawWalks.Application.DTOs.Walks;

namespace PawWalks.Application.Features.Walks.Commands;

/// <summary>
/// Command to create a new walk
/// </summary>
public class CreateWalkCommand : IRequest<Guid>
{
    public WalkCreateRequest Request { get; set; } = null!;
}

