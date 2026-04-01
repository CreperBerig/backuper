using backuper.Models;
using backuper.Repositories;
using backuper.Services;
using Microsoft.AspNetCore.Mvc;

namespace backuper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BackupsController : ControllerBase
    {
        private readonly BackupRepository _backupRepository;
        private readonly DatabaseRepository _databaseRepository;
        private readonly BackupService _backupService;

        public BackupsController(
            BackupRepository backupRepository,
            DatabaseRepository databaseRepository,
            BackupService backupService)
        {
            _backupRepository = backupRepository;
            _databaseRepository = databaseRepository;
            _backupService = backupService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var backups = await _backupRepository.GetAll();
            return Ok(backups);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var backup = await _backupRepository.GetById(id);
            if(backup is null) return NotFound();
            return Ok(backup);
        }

        [HttpGet("database/{databaseId}")]
        public async Task<IActionResult> GetByDatabase(int databaseId)
        {
            var config = await _databaseRepository.GetById(databaseId);
            if (config is null) return NotFound();

            var backups = await _backupRepository.GetByDatabaseId(databaseId);
            return Ok(backups);
        }

        [HttpPost("database/{databaseId}")]
        public async Task<IActionResult> CreateManual(int databaseId)
        {
            var config = await _databaseRepository.GetById(databaseId);
            if (config is null) return NotFound();

            var record = new BackupRecord
            {
                DatabaseConfigId = config.Id,
                CreatedAt = DateTime.UtcNow,
                Status = BackupStatus.InProgress,
                Trigger = BackupTrigger.Manual,
                FilePath = string.Empty
            };
            await _backupRepository.Create(record);

            var (success, filePath, error) = await _backupService.RunBackup(config);

            record.Status = success ? BackupStatus.Success : BackupStatus.Failed;
            record.FilePath = filePath;
            record.SizeBytes = success ? new FileInfo(filePath).Length : 0;
            record.ErrorMessage = error;
            await _backupRepository.Update(record.Id, record);

            if (!success)
                return StatusCode(500, new { message = error });

            return Ok(record);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var backup = await _backupRepository.GetById(id);
            if(backup is null) return NotFound();

            _backupService.DeleteFile(backup.FilePath);
            await _backupRepository.DeleteById(id);
            return Ok(true);
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(int id)
        {
            var backup = await _backupRepository.GetById(id);
            if(backup is null) return NotFound(new { message = "backup not found" });
            if(!System.IO.File.Exists(backup.FilePath)) return NotFound(new { message = "file not found" });

            var stream = System.IO.File.OpenRead(backup.FilePath);
            var fileName = Path.GetFileName(backup.FilePath);
            return File(stream, "application/octet-stream", fileName);
        }

        [HttpPost("database/{databaseId}/cleanup")]
        public async Task<IActionResult> Cleanup(int databaseId)
        {
            var config = await _databaseRepository.GetById(databaseId);
            if(config is null) return NotFound(new { message = "database not found" });

            var cutoff = DateTime.UtcNow.AddDays(-config.RetentionDays);
            var old = await _backupRepository.GetOlderThan(databaseId, cutoff);

            foreach (var backup in old)
            {
                _backupService.DeleteFile(backup.FilePath);
                await _backupRepository.DeleteById(backup.Id);
            }

            return Ok(new { count = old.Count });
        }
    }
}
