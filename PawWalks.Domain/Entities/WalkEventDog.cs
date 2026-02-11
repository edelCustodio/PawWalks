namespace PawWalks.Domain.Entities;

/// <summary>
/// Join entity for the many-to-many relationship between WalkEvent and Dog
/// </summary>
public class WalkEventDog
{
    public Guid WalkEventId { get; set; }
    public Guid DogId { get; set; }

    // Navigation properties
    public WalkEvent WalkEvent { get; set; } = null!;
    public Dog Dog { get; set; } = null!;
}
