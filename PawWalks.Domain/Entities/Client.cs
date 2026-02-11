using PawWalks.Domain.Common;

namespace PawWalks.Domain.Entities;

/// <summary>
/// Represents a client who owns dogs and schedules walks
/// </summary>
public class Client : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? AddressLine1 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Zip { get; set; }

    // Navigation properties
    public ICollection<Dog> Dogs { get; set; } = new List<Dog>();
}
