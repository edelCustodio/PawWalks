using MediatR;
using PawWalks.Application.Common;
using PawWalks.Application.DTOs.Dogs;

namespace PawWalks.Application.Features.Dogs.Queries;

/// <summary>
/// Query to get paginated list of dogs with filters
/// </summary>
public class GetDogsQuery : IRequest<PagedResult<DogListItemDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public Guid? ClientId { get; set; }
    public bool? IsActive { get; set; }
    public string? Search { get; set; }
}

