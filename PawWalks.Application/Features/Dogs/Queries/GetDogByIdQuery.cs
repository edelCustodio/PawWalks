using MediatR;
using PawWalks.Application.DTOs.Dogs;

namespace PawWalks.Application.Features.Dogs.Queries;

/// <summary>
/// Query to get a dog by ID with details
/// </summary>
public class GetDogByIdQuery : IRequest<DogDetailDto>
{
    public Guid Id { get; set; }
}


