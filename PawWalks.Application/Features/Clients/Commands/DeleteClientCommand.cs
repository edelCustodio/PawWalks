using MediatR;

namespace PawWalks.Application.Features.Clients.Commands;

/// <summary>
/// Command to soft delete a client
/// </summary>
public class DeleteClientCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}


