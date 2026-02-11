using MediatR;
using PawWalks.Application.Common;
using PawWalks.Application.DTOs.Clients;

namespace PawWalks.Application.Features.Clients.Queries;

/// <summary>
/// Query to get paginated list of clients with optional search
/// </summary>
public class GetClientsQuery : IRequest<PagedResult<ClientListItemDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
}
