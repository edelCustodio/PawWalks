using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace PawWalks.Infrastructure.Data;

/// <summary>
/// Factory for creating DbContext instances at design time for EF Core tools (migrations, etc.)
/// </summary>
public class PawWalksDbContextFactory : IDesignTimeDbContextFactory<PawWalksDbContext>
{
    public PawWalksDbContext CreateDbContext(string[] args)
    {
        // Build configuration to read appsettings from the API project
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../PawWalks.Api"))
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        // Get connection string
        var connectionString = configuration.GetConnectionString("PawWalksDb");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException(
                "Connection string 'PawWalksDb' not found in appsettings.json");
        }

        // Build DbContextOptions
        var optionsBuilder = new DbContextOptionsBuilder<PawWalksDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        return new PawWalksDbContext(optionsBuilder.Options);
    }
}
