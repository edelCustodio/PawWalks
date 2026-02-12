using MediatR;
using Microsoft.EntityFrameworkCore;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Application.Common;
using PawWalks.Application.Common.Extensions;
using PawWalks.Application.DTOs.Clients;
using PawWalks.Application.Mappings;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Clients.Queries.Handlers;

/// <summary>
/// Handler for getting paginated clients with search
/// </summary>
public class GetClientsQueryHandler : IRequestHandler<GetClientsQuery, PagedResult<ClientDetailDto>>
{
    private readonly IRepository<Client> _clientRepository;

    public GetClientsQueryHandler(IRepository<Client> clientRepository)
    {
        _clientRepository = clientRepository;
    }

    public async Task<PagedResult<ClientDetailDto>> Handle(GetClientsQuery request, CancellationToken cancellationToken)
    {
        var query = _clientRepository.GetAll()
			.Include(c => c.Dogs.Where(w => w.IsActive)).AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLower();
            query = query.Where(c =>
                c.FirstName.ToLower().Contains(searchLower) ||
                c.LastName.ToLower().Contains(searchLower) ||
                c.Email.ToLower().Contains(searchLower) ||
                c.Phone.Contains(searchLower));
        }

        // Order by last name
        query = query.OrderBy(c => c.LastName).ThenBy(c => c.FirstName);

        // Apply pagination with projection
        return await query.ToPagedListAsync(
            c => c.ToDetailDto(),
            request.Page,
            request.PageSize,
            cancellationToken);
    }
}
