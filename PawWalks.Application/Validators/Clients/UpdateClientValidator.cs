using FluentValidation;
using PawWalks.Application.DTOs.Clients;

namespace PawWalks.Application.Validators.Clients;

/// <summary>
/// Validator for client update requests
/// </summary>
public class UpdateClientValidator : AbstractValidator<ClientUpdateRequest>
{
    public UpdateClientValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MinimumLength(2).WithMessage("First name must be at least 2 characters")
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MinimumLength(2).WithMessage("Last name must be at least 2 characters")
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .Matches(@"^[\d\s\-\(\)\+]+$").WithMessage("Invalid phone format")
            .MaximumLength(20).WithMessage("Phone cannot exceed 20 characters");

        RuleFor(x => x.AddressLine1)
            .MaximumLength(255).WithMessage("Address cannot exceed 255 characters");

        RuleFor(x => x.City)
            .MaximumLength(100).WithMessage("City cannot exceed 100 characters");

        RuleFor(x => x.State)
            .MaximumLength(50).WithMessage("State cannot exceed 50 characters");

        RuleFor(x => x.Zip)
            .MaximumLength(10).WithMessage("Zip cannot exceed 10 characters");
    }
}
