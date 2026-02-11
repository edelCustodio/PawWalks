using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Application.Common.Exceptions;
using PawWalks.Application.DTOs.Walks;
using PawWalks.Application.Mappings;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Walks.Commands.Handlers
{
	/// <summary>
	/// Handler for creating a new walk
	/// </summary>
	public class CreateWalkCommandHandler : IRequestHandler<CreateWalkCommand, Guid>
	{
		private readonly IRepository<WalkEvent> _walkRepository;
		private readonly IRepository<Dog> _dogRepository;
		private readonly IAppDbContext _dbContext;
		private readonly IValidator<WalkCreateRequest> _validator;

		public CreateWalkCommandHandler(
			IRepository<WalkEvent> walkRepository,
			IRepository<Dog> dogRepository,
			IAppDbContext dbContext,
			IValidator<WalkCreateRequest> validator)
		{
			_walkRepository = walkRepository;
			_dogRepository = dogRepository;
			_dbContext = dbContext;
			_validator = validator;
		}

		public async Task<Guid> Handle(CreateWalkCommand request, CancellationToken cancellationToken)
		{
			// Validate
			var validationResult = await _validator.ValidateAsync(request.Request, cancellationToken);
			if (!validationResult.IsValid)
			{
				var errors = validationResult.Errors
					.GroupBy(e => e.PropertyName)
					.ToDictionary(
						g => g.Key,
						g => g.Select(e => e.ErrorMessage).ToArray());

				throw new Common.Exceptions.ValidationException(errors);
			}

			// Validate dogs exist and are active
			var dogs = await _dogRepository.GetAll()
				.Where(d => request.Request.DogIds.Contains(d.Id))
				.ToListAsync(cancellationToken);

			if (dogs.Count != request.Request.DogIds.Count)
				throw new Common.Exceptions.ValidationException("One or more dogs not found");

			var inactiveDogs = dogs.Where(d => !d.IsActive).ToList();
			if (inactiveDogs.Any())
			{
				var dogNames = string.Join(", ", inactiveDogs.Select(d => d.Name));
				throw new BusinessRuleException($"All dogs must be active. Inactive dogs: {dogNames}");
			}

			// Create walk
			var walk = request.Request.ToEntity();

			await _walkRepository.AddAsync(walk, cancellationToken);
			await _walkRepository.SaveAsync(cancellationToken);

			// Create walk-dog relationships
			foreach (var dogId in request.Request.DogIds)
			{
				var walkEventDog = new WalkEventDog
				{
					WalkEventId = walk.Id,
					DogId = dogId
				};
				await _dbContext.WalkEventDogs.AddAsync(walkEventDog, cancellationToken);
			}

			await _dbContext.SaveAsync(cancellationToken);

			return walk.Id;
		}
	}

}
