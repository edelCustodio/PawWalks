using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PawWalks.Application.Abstractions;
using PawWalks.Domain.Common;
using PawWalks.Domain.Entities;

namespace PawWalks.Infrastructure.Data;

/// <summary>
/// Entity Framework Core database context
/// </summary>
public class PawWalksDbContext : DbContext, IAppDbContext
{
    public PawWalksDbContext(DbContextOptions<PawWalksDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients { get; set; } = null!;
    public DbSet<Dog> Dogs { get; set; } = null!;
    public DbSet<WalkEvent> WalkEvents { get; set; } = null!;
    public DbSet<WalkEventDog> WalkEventDogs { get; set; } = null!;

    public async Task<int> SaveAsync(CancellationToken cancellationToken = default)
    {
        return await SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all entity configurations from this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PawWalksDbContext).Assembly);

        // Apply global query filter for soft delete on all entities that inherit from BaseEntity
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                var parameter = Expression.Parameter(entityType.ClrType, "e");
                var property = Expression.Property(parameter, nameof(BaseEntity.IsDeleted));
                var filter = Expression.Lambda(
                    Expression.Equal(property, Expression.Constant(false)),
                    parameter);

                entityType.SetQueryFilter(filter);
            }
        }
    }
}
