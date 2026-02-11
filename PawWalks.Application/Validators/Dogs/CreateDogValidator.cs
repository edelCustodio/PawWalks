using FluentValidation;
using PawWalks.Application.DTOs.Dogs;

namespace PawWalks.Application.Validators.Dogs;

/// <summary>
/// Validator for dog create requests
/// </summary>
public class CreateDogValidator : AbstractValidator<DogCreateRequest>
{
    public CreateDogValidator()
    {
        RuleFor(x => x.ClientId)
            .NotEmpty().WithMessage("Client ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Breed)
            .NotEmpty().WithMessage("Breed is required")
            .MaximumLength(100).WithMessage("Breed cannot exceed 100 characters");

        RuleFor(x => x.BirthDate)
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Birth date cannot be in the future")
            .When(x => x.BirthDate.HasValue);

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes cannot exceed 500 characters");
    }
}
