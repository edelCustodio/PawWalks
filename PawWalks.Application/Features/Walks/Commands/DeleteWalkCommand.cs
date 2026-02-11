using MediatR;

namespace PawWalks.Application.Features.Walks.Commands;

/// <summary>
/// Command to soft delete a walk
/// </summary>
public class DeleteWalkCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}


