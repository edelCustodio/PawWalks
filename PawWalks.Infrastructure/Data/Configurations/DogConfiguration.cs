using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PawWalks.Domain.Entities;

namespace PawWalks.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Dog entity
/// </summary>
public class DogConfiguration : IEntityTypeConfiguration<Dog>
{
    public void Configure(EntityTypeBuilder<Dog> builder)
    {
        builder.ToTable("Dogs");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.Breed)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.BirthDate)
            .HasColumnType("date");

        builder.Property(d => d.Notes)
            .HasMaxLength(500);

        builder.Property(d => d.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Indexes
        builder.HasIndex(d => d.ClientId);
        builder.HasIndex(d => d.IsActive);
        builder.HasIndex(d => d.IsDeleted);

        // Relationships
        builder.HasOne(d => d.Client)
            .WithMany(c => c.Dogs)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(d => d.WalkEventDogs)
            .WithOne(wed => wed.Dog)
            .HasForeignKey(wed => wed.DogId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
