using MediatR;
using PawWalks.Application.DTOs.Dogs;

namespace PawWalks.Application.Features.Dogs.Commands;

/// <summary>
/// Command to update an existing dog
/// </summary>
public class UpdateDogCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
    public DogUpdateRequest Request { get; set; } = null!;
}


