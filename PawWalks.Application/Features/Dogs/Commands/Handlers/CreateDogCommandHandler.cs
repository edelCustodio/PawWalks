using FluentValidation;
using MediatR;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Application.Common.Exceptions;
using PawWalks.Application.DTOs.Dogs;
using PawWalks.Application.Mappings;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Dogs.Commands.Handlers
{
	/// <summary>
	/// Handler for creating a new dog
	/// </summary>
	public class CreateDogCommandHandler : IRequestHandler<CreateDogCommand, Guid>
	{
		private readonly IRepository<Dog> _dogRepository;
		private readonly IRepository<Client> _clientRepository;
		private readonly IValidator<DogCreateRequest> _validator;

		public CreateDogCommandHandler(
			IRepository<Dog> dogRepository,
			IRepository<Client> clientRepository,
			IValidator<DogCreateRequest> validator)
		{
			_dogRepository = dogRepository;
			_clientRepository = clientRepository;
			_validator = validator;
		}

		public async Task<Guid> Handle(CreateDogCommand request, CancellationToken cancellationToken)
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

			// Check if client exists
			var clientExists = await _clientRepository.AnyAsync(
				c => c.Id == request.Request.ClientId,
				cancellationToken);

			if (!clientExists)
				throw new NotFoundException(nameof(Client), request.Request.ClientId);

			// Create entity
			var dog = request.Request.ToEntity();

			await _dogRepository.AddAsync(dog, cancellationToken);
			await _dogRepository.SaveAsync(cancellationToken);

			return dog.Id;
		}
	}
}
