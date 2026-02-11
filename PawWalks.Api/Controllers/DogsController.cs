using MediatR;
using Microsoft.AspNetCore.Mvc;
using PawWalks.Application.DTOs.Dogs;
using PawWalks.Application.Features.Dogs.Commands;
using PawWalks.Application.Features.Dogs.Queries;

namespace PawWalks.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class DogsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DogsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetDogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] Guid? clientId = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] string? search = null)
    {
        var query = new GetDogsQuery
        {
            Page = page,
            PageSize = pageSize,
            ClientId = clientId,
            IsActive = isActive,
            Search = search
        };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDogById(Guid id)
    {
        var query = new GetDogByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDog([FromBody] DogCreateRequest request)
    {
        var command = new CreateDogCommand { Request = request };
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetDogById), new { id }, new { id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDog(Guid id, [FromBody] DogUpdateRequest request)
    {
        var command = new UpdateDogCommand { Id = id, Request = request };
        await _mediator.Send(command);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDog(Guid id)
    {
        var command = new DeleteDogCommand { Id = id };
        await _mediator.Send(command);
        return NoContent();
    }
}
