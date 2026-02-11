using MediatR;
using Microsoft.AspNetCore.Mvc;
using PawWalks.Application.DTOs.Walks;
using PawWalks.Application.Features.Walks.Commands;
using PawWalks.Application.Features.Walks.Queries;
using PawWalks.Domain.Enums;

namespace PawWalks.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class WalksController : ControllerBase
{
    private readonly IMediator _mediator;

    public WalksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetWalks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] DateTimeOffset? from = null,
        [FromQuery] DateTimeOffset? to = null,
        [FromQuery] Guid? clientId = null,
        [FromQuery] Guid? dogId = null,
        [FromQuery] WalkStatus? status = null)
    {
        var query = new GetWalksQuery
        {
            Page = page,
            PageSize = pageSize,
            From = from,
            To = to,
            ClientId = clientId,
            DogId = dogId,
            Status = status
        };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetWalkById(Guid id)
    {
        var query = new GetWalkByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateWalk([FromBody] WalkCreateRequest request)
    {
        var command = new CreateWalkCommand { Request = request };
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetWalkById), new { id }, new { id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWalk(Guid id, [FromBody] WalkUpdateRequest request)
    {
        var command = new UpdateWalkCommand { Id = id, Request = request };
        await _mediator.Send(command);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWalk(Guid id)
    {
        var command = new DeleteWalkCommand { Id = id };
        await _mediator.Send(command);
        return NoContent();
    }
}
