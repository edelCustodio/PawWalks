using MediatR;
using Microsoft.EntityFrameworkCore;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Application.Common.Exceptions;
using PawWalks.Application.DTOs.Walks;
using PawWalks.Application.Mappings;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Walks.Queries;

/// <summary>
/// Query to get a walk by ID with details
/// </summary>
public class GetWalkByIdQuery : IRequest<WalkDetailDto>
{
    public Guid Id { get; set; }
}

/// <summary>
/// Handler for getting a walk by ID
/// </summary>
public class GetWalkByIdQueryHandler : IRequestHandler<GetWalkByIdQuery, WalkDetailDto>
{
    private readonly IRepository<WalkEvent> _walkRepository;

    public GetWalkByIdQueryHandler(IRepository<WalkEvent> walkRepository)
    {
        _walkRepository = walkRepository;
    }

    public async Task<WalkDetailDto> Handle(GetWalkByIdQuery request, CancellationToken cancellationToken)
    {
        var walk = await _walkRepository.GetAll()
            .Include(w => w.WalkEventDogs)
                .ThenInclude(wed => wed.Dog)
                    .ThenInclude(d => d.Client)
            .FirstOrDefaultAsync(w => w.Id == request.Id, cancellationToken);

        if (walk == null)
            throw new NotFoundException(nameof(WalkEvent), request.Id);

        return walk.ToDetailDto();
    }
}
