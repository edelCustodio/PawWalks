using MediatR;
using Microsoft.EntityFrameworkCore;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Application.Common;
using PawWalks.Application.Common.Extensions;
using PawWalks.Application.DTOs.Dogs;
using PawWalks.Application.Mappings;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Dogs.Queries.Handlers
{
	/// <summary>
	/// Handler for getting paginated dogs with filters
	/// </summary>
	public class GetDogsQueryHandler : IRequestHandler<GetDogsQuery, PagedResult<DogListItemDto>>
	{
		private readonly IRepository<Dog> _dogRepository;

		public GetDogsQueryHandler(IRepository<Dog> dogRepository)
		{
			_dogRepository = dogRepository;
		}

		public async Task<PagedResult<DogListItemDto>> Handle(GetDogsQuery request, CancellationToken cancellationToken)
		{
			IQueryable<Dog> query = _dogRepository.GetAll().Include(d => d.Client);

			// Apply filters
			if (request.ClientId.HasValue)
				query = query.Where(d => d.ClientId == request.ClientId.Value);

			if (request.IsActive.HasValue)
				query = query.Where(d => d.IsActive == request.IsActive.Value);

			if (!string.IsNullOrWhiteSpace(request.Search))
			{
				var searchLower = request.Search.ToLower();
				query = query.Where(d =>
					d.Name.ToLower().Contains(searchLower) ||
					d.Breed.ToLower().Contains(searchLower));
			}

			// Order by name
			query = query.OrderBy(d => d.Name);

			// Apply pagination with projection
			return await query.ToPagedListAsync(
				d => d.ToListItemDto(),
				request.Page,
				request.PageSize,
				cancellationToken);
		}
	}

}
