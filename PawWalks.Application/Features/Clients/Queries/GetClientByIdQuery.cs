using MediatR;
using PawWalks.Application.DTOs.Clients;

namespace PawWalks.Application.Features.Clients.Queries;

/// <summary>
/// Query to get a client by ID with details
/// </summary>
public class GetClientByIdQuery : IRequest<ClientDetailDto>
{
    public Guid Id { get; set; }
}


