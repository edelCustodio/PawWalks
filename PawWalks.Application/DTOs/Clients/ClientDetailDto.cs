using PawWalks.Application.DTOs.Dogs;

namespace PawWalks.Application.DTOs.Clients;

/// <summary>
/// DTO for displaying detailed client information including dogs
/// </summary>
public class ClientDetailDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? AddressLine1 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Zip { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
	public int TotalDogs
	{
		get
		{
			return this.Dogs.Count;
		}
	}
	public List<DogDetailDto> Dogs { get; set; } = new();
}
