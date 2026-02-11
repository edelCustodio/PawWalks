using MediatR;
using Microsoft.EntityFrameworkCore;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Application.Common.Exceptions;
using PawWalks.Application.DTOs.Clients;
using PawWalks.Application.Mappings;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Clients.Queries.Handlers
{
	/// <summary>
	/// Handler for getting a client by ID
	/// </summary>
	public class GetClientByIdQueryHandler : IRequestHandler<GetClientByIdQuery, ClientDetailDto>
	{
		private readonly IRepository<Client> _clientRepository;

		public GetClientByIdQueryHandler(IRepository<Client> clientRepository)
		{
			_clientRepository = clientRepository;
		}

		public async Task<ClientDetailDto> Handle(GetClientByIdQuery request, CancellationToken cancellationToken)
		{
			var client = await _clientRepository.GetAll()
				.Include(c => c.Dogs)
				.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

			if (client == null)
				throw new NotFoundException(nameof(Client), request.Id);

			return client.ToDetailDto();
		}
	}
}
