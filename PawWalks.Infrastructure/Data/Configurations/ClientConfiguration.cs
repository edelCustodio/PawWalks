using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PawWalks.Domain.Entities;

namespace PawWalks.Infrastructure.Data.Configurations;

/// <summary>
/// Entity Framework configuration for Client entity
/// </summary>
public class ClientConfiguration : IEntityTypeConfiguration<Client>
{
    public void Configure(EntityTypeBuilder<Client> builder)
    {
        builder.ToTable("Clients");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.Phone)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.AddressLine1)
            .HasMaxLength(255);

        builder.Property(c => c.City)
            .HasMaxLength(100);

        builder.Property(c => c.State)
            .HasMaxLength(50);

        builder.Property(c => c.Zip)
            .HasMaxLength(10);

        // Indexes
        builder.HasIndex(c => c.Email);
        builder.HasIndex(c => c.IsDeleted);

        // Relationships
        builder.HasMany(c => c.Dogs)
            .WithOne(d => d.Client)
            .HasForeignKey(d => d.ClientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
