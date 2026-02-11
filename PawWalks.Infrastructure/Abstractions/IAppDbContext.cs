using Microsoft.EntityFrameworkCore;
using PawWalks.Domain.Entities;

namespace PawWalks.Infrastructure.Abstractions;

/// <summary>
/// Interface for the application database context
/// </summary>
public interface IAppDbContext
{
    DbSet<Client> Clients { get; set; }
    DbSet<Dog> Dogs { get; set; }
    DbSet<WalkEvent> WalkEvents { get; set; }
    DbSet<WalkEventDog> WalkEventDogs { get; set; }

    Task<int> SaveAsync(CancellationToken cancellationToken = default);
}
