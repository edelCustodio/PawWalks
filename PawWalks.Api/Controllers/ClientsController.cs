using MediatR;
using Microsoft.AspNetCore.Mvc;
using PawWalks.Application.DTOs.Clients;
using PawWalks.Application.Features.Clients.Commands;
using PawWalks.Application.Features.Clients.Queries;

namespace PawWalks.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ClientsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetClients([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
    {
        var query = new GetClientsQuery { Page = page, PageSize = pageSize, Search = search };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetClientById(Guid id)
    {
        var query = new GetClientByIdQuery { Id = id };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateClient([FromBody] ClientCreateRequest request)
    {
        var command = new CreateClientCommand { Request = request };
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetClientById), new { id }, new { id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClient(Guid id, [FromBody] ClientUpdateRequest request)
    {
        var command = new UpdateClientCommand { Id = id, Request = request };
        await _mediator.Send(command);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClient(Guid id)
    {
        var command = new DeleteClientCommand { Id = id };
        await _mediator.Send(command);
        return NoContent();
    }
}
