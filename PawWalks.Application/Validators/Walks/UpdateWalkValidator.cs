using FluentValidation;
using PawWalks.Application.DTOs.Walks;

namespace PawWalks.Application.Validators.Walks;

/// <summary>
/// Validator for walk update requests
/// </summary>
public class UpdateWalkValidator : AbstractValidator<WalkUpdateRequest>
{
    public UpdateWalkValidator()
    {
        RuleFor(x => x.StartAt)
            .NotEmpty().WithMessage("Start date and time is required");

        RuleFor(x => x.DurationMinutes)
            .GreaterThanOrEqualTo(10).WithMessage("Duration must be at least 10 minutes")
            .LessThanOrEqualTo(240).WithMessage("Duration cannot exceed 240 minutes (4 hours)");

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes cannot exceed 500 characters");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid walk status");

        RuleFor(x => x.DogIds)
            .NotEmpty().WithMessage("At least one dog must be selected")
            .Must(ids => ids.Distinct().Count() == ids.Count)
            .WithMessage("Duplicate dog IDs are not allowed");
    }
}
