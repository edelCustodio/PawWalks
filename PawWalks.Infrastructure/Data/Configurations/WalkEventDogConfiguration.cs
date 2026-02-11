using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PawWalks.Domain.Entities;

namespace PawWalks.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for WalkEventDog join entity
/// </summary>
public class WalkEventDogConfiguration : IEntityTypeConfiguration<WalkEventDog>
{
    public void Configure(EntityTypeBuilder<WalkEventDog> builder)
    {
        builder.ToTable("WalkEventDogs");

        // Composite primary key
        builder.HasKey(wed => new { wed.WalkEventId, wed.DogId });

        // Indexes
        builder.HasIndex(wed => wed.WalkEventId);
        builder.HasIndex(wed => wed.DogId);

        // Relationships are configured in WalkEvent and Dog configurations
    }
}
