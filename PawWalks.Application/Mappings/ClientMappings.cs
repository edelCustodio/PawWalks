using PawWalks.Application.DTOs.Clients;
using PawWalks.Domain.Entities;

namespace PawWalks.Application.Mappings;

/// <summary>
/// Extension methods for mapping between Client entity and DTOs
/// </summary>
public static class ClientMappings
{
    public static ClientListItemDto ToListItemDto(this Client client)
    {
        return new ClientListItemDto
        {
            Id = client.Id,
            FullName = $"{client.FirstName} {client.LastName}",
            Email = client.Email,
            Phone = client.Phone
        };
    }

    public static ClientDetailDto ToDetailDto(this Client client)
    {
        return new ClientDetailDto
        {
            Id = client.Id,
            FirstName = client.FirstName,
            LastName = client.LastName,
            Email = client.Email,
            Phone = client.Phone,
            AddressLine1 = client.AddressLine1,
            City = client.City,
            State = client.State,
            Zip = client.Zip,
            CreatedAt = client.CreatedAt,
            UpdatedAt = client.UpdatedAt,
            Dogs = client.Dogs.Select(d => d.ToListItemDto()).ToList()
        };
    }

    public static Client ToEntity(this ClientCreateRequest request)
    {
        return new Client
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            AddressLine1 = request.AddressLine1,
            City = request.City,
            State = request.State,
            Zip = request.Zip
        };
    }

    public static void UpdateEntity(this ClientUpdateRequest request, Client client)
    {
        client.FirstName = request.FirstName;
        client.LastName = request.LastName;
        client.Email = request.Email;
        client.Phone = request.Phone;
        client.AddressLine1 = request.AddressLine1;
        client.City = request.City;
        client.State = request.State;
        client.Zip = request.Zip;
    }
}
