using backuper.Models;
using backuper.Repositories;
using backuper.Services;
using Microsoft.AspNetCore.Mvc;

namespace backuper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabasesController : ControllerBase
    {
        private readonly DatabaseRepository _repository;
        private readonly BackupRepository _backupRepository;
        private readonly BackupService _backupService;
        private readonly SchedulerService _schedulerService;

        public DatabasesController(
            DatabaseRepository repository, 
            BackupRepository backupRepository, 
            BackupService backupService,
            SchedulerService schedulerService)
        {
            _repository = repository;
            _backupRepository = backupRepository;
            _backupService = backupService;
            _schedulerService = schedulerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var configs = await _repository.GetAll();
            return Ok(configs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var config = await _repository.GetById(id);
            if (config is null) return NotFound();
            return Ok(config);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DatabaseConfig config)
        {
            var created = await _repository.Create(config);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DatabaseConfig config)
        {
            var updated = await _repository.Update(id, config);
            if (updated is null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] bool deleteFile = false)
        {
            var config = await _repository.GetById(id);
            if (config is null) return NotFound();

            var backups = await _backupRepository.GetByDatabaseId(id);

            foreach (var backup in backups)
            {
                if (deleteFile)
                    _backupService.DeleteFile(backup.FilePath);
                else
                    _backupService.MoveToSave(config, backup.FilePath);

                await _backupRepository.DeleteById(backup.Id);
            }

            _backupService.CleanupEmptyDir(config);
            await _repository.DeleteById(id);
            return Ok(true);
        }

        [HttpPost("test/{id}")]
        public async Task<IActionResult> TestConnection(int id)
        {
            var config = await _repository.GetById(id);
            if (config is null) return NotFound();

            var result = await CheckConnection(config);
            return Ok(result);
        }

        [HttpPost("test")]
        public async Task<IActionResult> TestConnection([FromBody] DatabaseConfig config)
        {
            var result = await CheckConnection(config);
            return Ok(result);
        }

        private async Task<bool> CheckConnection(DatabaseConfig config)
        {
            try
            {
                switch (config.Type)
                {
                    case DatabasesType.PostgresSQL:
                        return await CheckConnectionService.PostgreSQL(config);

                    case DatabasesType.MySQL:
                        return await CheckConnectionService.MySQL(config);

                    case DatabasesType.MSSQL:
                        return await CheckConnectionService.MSSQL(config);

                    case DatabasesType.SQLite:
                        return await CheckConnectionService.SQLite(config);

                    default:
                        return false;
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
