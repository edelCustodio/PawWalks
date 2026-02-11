using PawWalks.Domain.Common;

namespace PawWalks.Domain.Entities;

/// <summary>
/// Represents a dog that belongs to a client and can be included in walks
/// </summary>
public class Dog : BaseEntity
{
    public Guid ClientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public DateOnly? BirthDate { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Client Client { get; set; } = null!;
    public ICollection<WalkEventDog> WalkEventDogs { get; set; } = new List<WalkEventDog>();
}
