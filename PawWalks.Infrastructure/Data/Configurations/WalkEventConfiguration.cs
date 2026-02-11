using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PawWalks.Domain.Entities;
using PawWalks.Domain.Enums;

namespace PawWalks.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for WalkEvent entity
/// </summary>
public class WalkEventConfiguration : IEntityTypeConfiguration<WalkEvent>
{
    public void Configure(EntityTypeBuilder<WalkEvent> builder)
    {
        builder.ToTable("WalkEvents");

        builder.HasKey(w => w.Id);

        builder.Property(w => w.StartAt)
            .IsRequired();

        builder.Property(w => w.DurationMinutes)
            .IsRequired();

        builder.Property(w => w.Notes)
            .HasMaxLength(500);

        builder.Property(w => w.Status)
            .IsRequired()
            .HasConversion<string>();

        // Indexes
        builder.HasIndex(w => w.StartAt);
        builder.HasIndex(w => w.Status);
        builder.HasIndex(w => w.IsDeleted);

        // Relationships
        builder.HasMany(w => w.WalkEventDogs)
            .WithOne(wed => wed.WalkEvent)
            .HasForeignKey(wed => wed.WalkEventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
