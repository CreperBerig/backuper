using backuper.Data;
using backuper.Models;
using Microsoft.EntityFrameworkCore;

namespace backuper.Repositories
{
    public class BackupRepository : ICRUDRepository<BackupRecord>
    {
        private readonly AppDbContext _db;
        private readonly ILogger<BackupRepository> _logger;

        public BackupRepository(AppDbContext db, ILogger<BackupRepository> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<List<BackupRecord>> GetAll()
        {
            _logger.LogDebug("Get all backups");
            return await _db.Backups.Include(b => b.DatabaseConfig).ToListAsync();
        }

        public async Task<BackupRecord?> GetById(int id)
        {
            _logger.LogDebug("Get backup by ID: {id}", id);
            return await _db.Backups.Include(b => b.DatabaseConfig).FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<BackupRecord> Create(BackupRecord entity)
        {
            _logger.LogDebug("Create backup: {entity}", entity);
            _db.Backups.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<BackupRecord?> Update(int id, BackupRecord entity)
        {
            _logger.LogDebug("Update backup with {id} id: {entity}", id, entity);
            var existing = await _db.Backups.FindAsync(id);
            if (existing is null) return null;

            existing.Status = entity.Status;
            existing.SizeBytes = entity.SizeBytes;
            existing.FilePath = entity.FilePath;
            existing.ErrorMessage = entity.ErrorMessage;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteById(int id)
        {
            _logger.LogDebug("Delete backup by ID: {id}", id);
            var existing = await _db.Backups.FindAsync(id);
            if (existing is null) return false;

            _db.Backups.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<BackupRecord>> GetByDatabaseId(int databaseId)
        {
            _logger.LogDebug("Get all database backup by database ID: {id}", databaseId);
            return await _db.Backups
                .Where(b => b.DatabaseConfigId == databaseId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<BackupRecord>> GetOlderThan(int databaseId, DateTime cutoff)
        {
            return await _db.Backups
                .Where(b => b.DatabaseConfigId == databaseId && b.CreatedAt < cutoff)
                .ToListAsync();
        }

        public async Task DeleteRange(List<BackupRecord> backups)
        {
            _db.Backups.RemoveRange(backups);
            await _db.SaveChangesAsync();
        }
    }
}
