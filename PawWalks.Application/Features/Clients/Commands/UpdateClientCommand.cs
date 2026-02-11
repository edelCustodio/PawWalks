using MediatR;
using PawWalks.Application.DTOs.Clients;

namespace PawWalks.Application.Features.Clients.Commands;

/// <summary>
/// Command to update an existing client
/// </summary>
public class UpdateClientCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
    public ClientUpdateRequest Request { get; set; } = null!;
}


