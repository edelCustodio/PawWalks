using MediatR;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Application.Common.Exceptions;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Clients.Commands.Handlers
{
	/// <summary>
	/// Handler for soft deleting a client
	/// </summary>
	public class DeleteClientCommandHandler : IRequestHandler<DeleteClientCommand, Unit>
	{
		private readonly IRepository<Client> _clientRepository;

		public DeleteClientCommandHandler(IRepository<Client> clientRepository)
		{
			_clientRepository = clientRepository;
		}

		public async Task<Unit> Handle(DeleteClientCommand request, CancellationToken cancellationToken)
		{
			var client = await _clientRepository.GetByIdAsync(request.Id, cancellationToken);
			if (client == null)
				throw new NotFoundException(nameof(Client), request.Id);

			_clientRepository.Delete(client);
			await _clientRepository.SaveAsync(cancellationToken);

			return Unit.Value;
		}
	}
}
