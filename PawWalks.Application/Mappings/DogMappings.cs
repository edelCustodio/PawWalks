using PawWalks.Application.DTOs.Dogs;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Mappings;

/// <summary>
/// Extension methods for mapping between Dog entity and DTOs
/// </summary>
public static class DogMappings
{
    public static DogListItemDto ToListItemDto(this Dog dog)
    {
        return new DogListItemDto
        {
            Id = dog.Id,
            ClientId = dog.ClientId,
            Name = dog.Name,
            Breed = dog.Breed,
            IsActive = dog.IsActive,
            ClientName = dog.Client != null ? $"{dog.Client.FirstName} {dog.Client.LastName}" : null
        };
    }

    public static DogDetailDto ToDetailDto(this Dog dog)
    {
        return new DogDetailDto
        {
            Id = dog.Id,
            ClientId = dog.ClientId,
            Name = dog.Name,
            Breed = dog.Breed,
            BirthDate = dog.BirthDate,
            Notes = dog.Notes,
            IsActive = dog.IsActive,
            CreatedAt = dog.CreatedAt,
            UpdatedAt = dog.UpdatedAt,
            ClientName = dog.Client != null ? $"{dog.Client.FirstName} {dog.Client.LastName}" : null
        };
    }

    public static Dog ToEntity(this DogCreateRequest request)
    {
        return new Dog
        {
            ClientId = request.ClientId,
            Name = request.Name,
            Breed = request.Breed,
            BirthDate = request.BirthDate,
            Notes = request.Notes,
            IsActive = request.IsActive
        };
    }

    public static void UpdateEntity(this DogUpdateRequest request, Dog dog)
    {
        dog.ClientId = request.ClientId;
        dog.Name = request.Name;
        dog.Breed = request.Breed;
        dog.BirthDate = request.BirthDate;
        dog.Notes = request.Notes;
        dog.IsActive = request.IsActive;
    }
}
