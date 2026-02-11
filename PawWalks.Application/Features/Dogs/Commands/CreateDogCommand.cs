using MediatR;
using PawWalks.Application.DTOs.Dogs;

namespace PawWalks.Application.Features.Dogs.Commands;

/// <summary>
/// Command to create a new dog
/// </summary>
public class CreateDogCommand : IRequest<Guid>
{
    public DogCreateRequest Request { get; set; } = null!;
}


