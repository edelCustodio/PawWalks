using MediatR;
using Microsoft.EntityFrameworkCore;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Application.Common.Exceptions;
using PawWalks.Application.DTOs.Dogs;
using PawWalks.Application.Mappings;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Dogs.Queries.Handlers
{
	/// <summary>
	/// Handler for getting a dog by ID
	/// </summary>
	public class GetDogByIdQueryHandler : IRequestHandler<GetDogByIdQuery, DogDetailDto>
	{
		private readonly IRepository<Dog> _dogRepository;

		public GetDogByIdQueryHandler(IRepository<Dog> dogRepository)
		{
			_dogRepository = dogRepository;
		}

		public async Task<DogDetailDto> Handle(GetDogByIdQuery request, CancellationToken cancellationToken)
		{
			var dog = await _dogRepository.GetAll()
				.Include(d => d.Client)
				.FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

			if (dog == null)
				throw new NotFoundException(nameof(Dog), request.Id);

			return dog.ToDetailDto();
		}
	}
}
