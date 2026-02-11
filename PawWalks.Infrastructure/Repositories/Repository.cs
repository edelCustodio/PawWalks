using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PawWalks.Infrastructure.Abstractions;
using PawWalks.Domain.Common;

namespace PawWalks.Infrastructure.Repositories;

/// <summary>
/// Generic repository implementation for data access operations
/// </summary>
/// <typeparam name="T">Entity type that extends BaseEntity</typeparam>
public class Repository<T> : IRepository<T> where T : BaseEntity
{
    private readonly IAppDbContext _database;
    private readonly DbContext _context;
    private readonly DbSet<T> _dbSet;

    public Repository(IAppDbContext database)
    {
        _database = database;
        _context = (DbContext)database;
        _dbSet = _context.Set<T>();
    }

    public IQueryable<T> GetAll()
    {
        return _dbSet;
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(predicate, cancellationToken);
    }

    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .AnyAsync(predicate, cancellationToken);
    }

    public async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default)
    {
        if (predicate != null)
            return await _dbSet.CountAsync(predicate, cancellationToken);

        return await _dbSet.CountAsync(cancellationToken);
    }

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        await _dbSet.AddAsync(entity, cancellationToken);
    }

    public void Update(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        _dbSet.Update(entity);
    }

    public void Delete(T entity)
    {
        // Soft delete implementation
        entity.IsDeleted = true;
        entity.DeletedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        _dbSet.Update(entity);
    }

    public async Task SaveAsync(CancellationToken cancellationToken = default)
    {
        await _database.SaveAsync(cancellationToken);
    }
}
