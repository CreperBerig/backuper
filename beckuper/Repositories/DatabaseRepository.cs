using backuper.Data;
using backuper.Models;
using Microsoft.EntityFrameworkCore;
namespace backuper.Repositories
{
    public class DatabaseRepository : ICRUDRepository<DatabaseConfig>
    {
        private readonly AppDbContext _db;

        public DatabaseRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<DatabaseConfig>> GetAll()
        {
            return await _db.Databases.ToListAsync();
        }

        public async Task<DatabaseConfig?> GetById(int id)
        {
            return await _db.Databases.FindAsync(id);
        }

        public async Task<DatabaseConfig> Create(DatabaseConfig config)
        {
            _db.Databases.Add(config);
            await _db.SaveChangesAsync();
            return config;
        }

        public async Task<DatabaseConfig?> Update(int id, DatabaseConfig entity)
        {
            var existing = await _db.Databases.FindAsync(id);
            if (existing is null) return null;

            existing.Name = entity.Name;
            existing.Type = entity.Type;
            existing.Host = entity.Host;
            existing.Port = entity.Port;
            existing.DatabaseName = entity.DatabaseName;
            existing.Username = entity.Username;
            existing.Password = entity.Password;
            existing.RetentionDays = entity.RetentionDays;
            existing.CronSchedule = entity.CronSchedule;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteById(int id)
        {
            var existing = await _db.Databases.FindAsync(id);
            if(existing is null) return false;

            _db.Databases.Remove(existing);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
