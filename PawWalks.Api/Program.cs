using FluentValidation;
using Microsoft.EntityFrameworkCore;
using PawWalks.Api.Middleware;
using PawWalks.Application;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Infrastructure.Data;
using PawWalks.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<PawWalksDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("PawWalksDb")));

builder.Services.AddScoped<IAppDbContext>(provider =>
    provider.GetRequiredService<PawWalksDbContext>());

// Repository pattern
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// MediatR - Registers all command/query handlers from Application assembly
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(IApplicationAssemblyMarker).Assembly));

// FluentValidation - Registers all validators from Application assembly
builder.Services.AddValidatorsFromAssembly(typeof(IApplicationAssemblyMarker).Assembly);

// CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:4210" };
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "PawWalks API", Version = "v1" });
});

var app = builder.Build();

// Apply pending database migrations
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<PawWalksDbContext>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.

// Global exception handler
app.UseMiddleware<GlobalExceptionHandler>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowAngular");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
