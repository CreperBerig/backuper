using backuper.Models;
using backuper.Repositories;
using Hangfire;

namespace backuper.Services
{
    public class SchedulerService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly AppSettingsService _appSettings;
        private readonly IRecurringJobManager _recurringJobManager;

        public SchedulerService(IServiceScopeFactory scopeFactory, AppSettingsService appSettings, IRecurringJobManager recurringJobManager)
        {
            _scopeFactory = scopeFactory;
            _appSettings = appSettings;
            _recurringJobManager = recurringJobManager;
        }

        #region Scheduled Jobs
        public async Task ScheduleAllAsync()
        {
            using var scope = _scopeFactory.CreateScope();
            var dbRepository = scope.ServiceProvider.GetRequiredService<ICRUDRepository<DatabaseConfig>>();

            var databases = await dbRepository.GetAll();
            foreach (var db in databases)
                Schedule(db);
        }

        public void Schedule(DatabaseConfig db)
        {
            var jobId = GetJobId(db);

            _recurringJobManager.AddOrUpdate(
                jobId,
                () => RunBackupJobAsync(db.Id),
                db.CronSchedule
            );
        }

        public void Unschedule(DatabaseConfig db)
        {
            _recurringJobManager.RemoveIfExists(GetJobId(db));
        }
        #endregion

        #region Jobs Work
        public async Task RunBackupJobAsync(int id)
        {
            using var scope = _scopeFactory.CreateScope();

            var dbRepository = scope.ServiceProvider.GetRequiredService<ICRUDRepository<DatabaseConfig>>();
            var backupRepository = scope.ServiceProvider.GetRequiredService<ICRUDRepository<BackupRecord>>();
            var backupService = scope.ServiceProvider.GetRequiredService<BackupService>();

            var config = await dbRepository.GetById(id);
            if (config is null) return;

            var settings = await _appSettings.GetAppSettingsData();

            var record = new BackupRecord
            {
                DatabaseConfigId = config.Id,
                CreatedAt = DateTime.UtcNow,
                Status = BackupStatus.InProgress,
                Trigger = BackupTrigger.Scheduled,
                FilePath = string.Empty,
            };
            await backupRepository.Create(record);

            var (success, filePath, error) = await RunWithRetriesAsync(config, backupService, settings);

            record.Status = success? BackupStatus.Success : BackupStatus.Failed;
            record.FilePath = filePath;
            record.SizeBytes = success ? new FileInfo(filePath).Length : 0;
            record.ErrorMessage = error;
            await backupRepository.Update(record.Id, record);
        }

        private static async Task<(bool Success, string FilePath, string? Error)> RunWithRetriesAsync(
            DatabaseConfig config,
            BackupService backupService,
            AppSettingsData settings)
        {
            string? lastError = null;

            for(int attempt = 1; attempt <= settings.RetryCount + 1; attempt++)
            {
                var result = await backupService.RunBackup(config);
                if (result.Success)
                    return (true, result.FilePath, null);
                lastError = result.Error;
                if (attempt <= settings.RetryCount)
                    await Task.Delay(TimeSpan.FromMinutes(settings.RetryDelayMinutes));
            }

            return (false, string.Empty, lastError);
        }
        #endregion

        #region Utils
        private static string GetJobId(DatabaseConfig config) =>
            $"backup-db-{config.Id}";
        #endregion
    }
}
