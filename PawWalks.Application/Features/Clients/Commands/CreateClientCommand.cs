using MediatR;
using PawWalks.Application.DTOs.Clients;

namespace PawWalks.Application.Features.Clients.Commands;

/// <summary>
/// Command to create a new client
/// </summary>
public class CreateClientCommand : IRequest<Guid>
{
    public ClientCreateRequest Request { get; set; } = null!;
}

