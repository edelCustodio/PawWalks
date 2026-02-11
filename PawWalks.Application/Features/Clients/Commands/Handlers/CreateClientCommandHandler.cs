using FluentValidation;
using MediatR;
using PawWalks.Application.Abstractions;
using PawWalks.Application.DTOs.Clients;
using PawWalks.Application.Mappings;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Clients.Commands.Handlers
{
	/// <summary>
	/// Handler for creating a new client
	/// </summary>
	public class CreateClientCommandHandler : IRequestHandler<CreateClientCommand, Guid>
	{
		private readonly IRepository<Client> _clientRepository;
		private readonly IValidator<ClientCreateRequest> _validator;

		public CreateClientCommandHandler(
			IRepository<Client> clientRepository,
			IValidator<ClientCreateRequest> validator)
		{
			_clientRepository = clientRepository;
			_validator = validator;
		}

		public async Task<Guid> Handle(CreateClientCommand request, CancellationToken cancellationToken)
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

			// Check if email already exists
			var emailExists = await _clientRepository.AnyAsync(
				c => c.Email == request.Request.Email,
				cancellationToken);

			if (emailExists)
				throw new Common.Exceptions.ValidationException("Email already exists");

			// Create entity
			var client = request.Request.ToEntity();

			await _clientRepository.AddAsync(client, cancellationToken);
			await _clientRepository.SaveAsync(cancellationToken);

			return client.Id;
		}
	}

}
