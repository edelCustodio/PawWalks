using MediatR;
using PawWalks.Application.Abstractions;
using PawWalks.Application.Common.Exceptions;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Features.Dogs.Commands.Handlers
{
	/// <summary>
	/// Handler for soft deleting a dog
	/// </summary>
	public class DeleteDogCommandHandler : IRequestHandler<DeleteDogCommand, Unit>
	{
		private readonly IRepository<Dog> _dogRepository;

		public DeleteDogCommandHandler(IRepository<Dog> dogRepository)
		{
			_dogRepository = dogRepository;
		}

		public async Task<Unit> Handle(DeleteDogCommand request, CancellationToken cancellationToken)
		{
			var dog = await _dogRepository.GetByIdAsync(request.Id, cancellationToken);
			if (dog == null)
				throw new NotFoundException(nameof(Dog), request.Id);

			_dogRepository.Delete(dog);
			await _dogRepository.SaveAsync(cancellationToken);

			return Unit.Value;
		}
	}
}
