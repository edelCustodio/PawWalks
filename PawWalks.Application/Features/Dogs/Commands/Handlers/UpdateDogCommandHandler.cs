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
	/// Handler for updating a dog
	/// </summary>
	public class UpdateDogCommandHandler : IRequestHandler<UpdateDogCommand, Unit>
	{
		private readonly IRepository<Dog> _dogRepository;
		private readonly IRepository<Client> _clientRepository;
		private readonly IValidator<DogUpdateRequest> _validator;

		public UpdateDogCommandHandler(
			IRepository<Dog> dogRepository,
			IRepository<Client> clientRepository,
			IValidator<DogUpdateRequest> validator)
		{
			_dogRepository = dogRepository;
			_clientRepository = clientRepository;
			_validator = validator;
		}

		public async Task<Unit> Handle(UpdateDogCommand request, CancellationToken cancellationToken)
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

			// Get existing dog
			var dog = await _dogRepository.GetByIdAsync(request.Id, cancellationToken);
			if (dog == null)
				throw new NotFoundException(nameof(Dog), request.Id);

			// Check if client exists
			var clientExists = await _clientRepository.AnyAsync(
				c => c.Id == request.Request.ClientId,
				cancellationToken);

			if (!clientExists)
				throw new NotFoundException(nameof(Client), request.Request.ClientId);

			// Update entity
			request.Request.UpdateEntity(dog);

			_dogRepository.Update(dog);
			await _dogRepository.SaveAsync(cancellationToken);

			return Unit.Value;
		}
	}
}
