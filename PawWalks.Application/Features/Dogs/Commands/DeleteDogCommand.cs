using MediatR;

namespace PawWalks.Application.Features.Dogs.Commands;

/// <summary>
/// Command to soft delete a dog
/// </summary>
public class DeleteDogCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}


