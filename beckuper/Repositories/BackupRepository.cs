using beckuper.Data;
using beckuper.Models;
using Microsoft.EntityFrameworkCore;

namespace beckuper.Repositories
{
    public class BackupRepository : ICRUDRepository<BackupRecord>
    {
        private readonly AppDbContext _db;

        public BackupRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<BackupRecord>> GetAll()
        {
            return await _db.Backups.Include(b => b.DatabaseConfig).ToListAsync();
        }

        public async Task<BackupRecord?> GetById(int id)
        {
            return await _db.Backups.Include(b => b.DatabaseConfig).FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<BackupRecord> Create(BackupRecord entity)
        {
            _db.Backups.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<BackupRecord?> Update(int id, BackupRecord entity)
        {
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
            var existing = await _db.Backups.FindAsync(id);
            if (existing is null) return false;

            _db.Backups.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<BackupRecord>> GetByDatabaseId(int databaseId)
        {
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
