using FluentValidation;
using MediatR;
using PawWalks.Application.Abstractions;
using PawWalks.Application.Common.Exceptions;
using PawWalks.Application.DTOs.Clients;
using PawWalks.Application.Mappings;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Clients.Commands.Handlers
{
	/// <summary>
	/// Handler for updating a client
	/// </summary>
	public class UpdateClientCommandHandler : IRequestHandler<UpdateClientCommand, Unit>
	{
		private readonly IRepository<Client> _clientRepository;
		private readonly IValidator<ClientUpdateRequest> _validator;

		public UpdateClientCommandHandler(
			IRepository<Client> clientRepository,
			IValidator<ClientUpdateRequest> validator)
		{
			_clientRepository = clientRepository;
			_validator = validator;
		}

		public async Task<Unit> Handle(UpdateClientCommand request, CancellationToken cancellationToken)
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

			// Get existing client
			var client = await _clientRepository.GetByIdAsync(request.Id, cancellationToken);
			if (client == null)
				throw new NotFoundException(nameof(Client), request.Id);

			// Check if email already exists for another client
			var emailExists = await _clientRepository.AnyAsync(
				c => c.Email == request.Request.Email && c.Id != request.Id,
				cancellationToken);

			if (emailExists)
				throw new Common.Exceptions.ValidationException("Email already exists");

			// Update entity
			request.Request.UpdateEntity(client);

			_clientRepository.Update(client);
			await _clientRepository.SaveAsync(cancellationToken);

			return Unit.Value;
		}
	}
}
