using MediatR;
using Microsoft.EntityFrameworkCore;
using PawWalks.Application.Abstractions;
using PawWalks.Application.Common;
using PawWalks.Application.Common.Extensions;
using PawWalks.Application.DTOs.Walks;
using PawWalks.Application.Mappings;
using PawWalks.Domain.Entities;
using PawWalks.Domain.Enums;

namespace PawWalks.Application.Features.Walks.Queries;

/// <summary>
/// Query to get paginated list of walks with filters
/// </summary>
public class GetWalksQuery : IRequest<PagedResult<WalkListItemDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public DateTimeOffset? From { get; set; }
    public DateTimeOffset? To { get; set; }
    public Guid? ClientId { get; set; }
    public Guid? DogId { get; set; }
    public WalkStatus? Status { get; set; }
}

/// <summary>
/// Handler for getting paginated walks with filters
/// </summary>
public class GetWalksQueryHandler : IRequestHandler<GetWalksQuery, PagedResult<WalkListItemDto>>
{
    private readonly IRepository<WalkEvent> _walkRepository;

    public GetWalksQueryHandler(IRepository<WalkEvent> walkRepository)
    {
        _walkRepository = walkRepository;
    }

    public async Task<PagedResult<WalkListItemDto>> Handle(GetWalksQuery request, CancellationToken cancellationToken)
    {
        IQueryable<WalkEvent> query = _walkRepository.GetAll()
            .Include(w => w.WalkEventDogs);

        // Apply filters
        if (request.From.HasValue)
            query = query.Where(w => w.StartAt >= request.From.Value);

        if (request.To.HasValue)
            query = query.Where(w => w.StartAt <= request.To.Value);

        if (request.Status.HasValue)
            query = query.Where(w => w.Status == request.Status.Value);

        if (request.DogId.HasValue)
            query = query.Where(w => w.WalkEventDogs.Any(wed => wed.DogId == request.DogId.Value));

        if (request.ClientId.HasValue)
        {
            query = query.Where(w => w.WalkEventDogs
                .Any(wed => wed.Dog.ClientId == request.ClientId.Value));
        }

        // Order by start time descending (most recent first)
        query = query.OrderByDescending(w => w.StartAt);

        // Apply pagination with projection
        return await query.ToPagedListAsync(
            w => w.ToListItemDto(),
            request.Page,
            request.PageSize,
            cancellationToken);
    }
}
