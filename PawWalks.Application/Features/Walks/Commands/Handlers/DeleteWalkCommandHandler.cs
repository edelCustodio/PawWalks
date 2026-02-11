using MediatR;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Application.Common.Exceptions;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Walks.Commands.Handlers
{
	/// <summary>
	/// Handler for soft deleting a walk
	/// </summary>
	public class DeleteWalkCommandHandler : IRequestHandler<DeleteWalkCommand, Unit>
	{
		private readonly IRepository<WalkEvent> _walkRepository;

		public DeleteWalkCommandHandler(IRepository<WalkEvent> walkRepository)
		{
			_walkRepository = walkRepository;
		}

		public async Task<Unit> Handle(DeleteWalkCommand request, CancellationToken cancellationToken)
		{
			var walk = await _walkRepository.GetByIdAsync(request.Id, cancellationToken);
			if (walk == null)
				throw new NotFoundException(nameof(WalkEvent), request.Id);

			_walkRepository.Delete(walk);
			await _walkRepository.SaveAsync(cancellationToken);

			return Unit.Value;
		}
	}
}
