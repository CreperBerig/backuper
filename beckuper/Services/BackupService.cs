using beckuper.Models;
using Microsoft.Data.SqlClient;
using System.Diagnostics;

namespace beckuper.Services
{
    public class BackupService
    {
        private readonly string _backupsRoot;
        private readonly string _saveRoot;

        public BackupService(IConfiguration config)
        {
            var volumeRoot = config["VolumePath"] ?? "/app";
            _backupsRoot = Path.Combine(volumeRoot, "backups");
            _saveRoot = Path.Combine(volumeRoot, "save");
        }

        #region Public methods
        public async Task<(bool Success, string FilePath, string? Error)> RunBackup(DatabaseConfig config)
        {
            try
            {
                var filePath = config.Type switch
                {
                    DatabasesType.PostgresSQL => await BackupPostgres(config),
                    DatabasesType.MySQL => await BackupMySQL(config),
                    DatabasesType.MSSQL => await BackupMSSQL(config),
                    DatabasesType.SQLite => await BackupSQLite(config),
                    _ => throw new NotSupportedException($"Type {config.Type} is not support")
                };

                return (true, filePath, null);
            } catch (Exception ex)
            {
                return (false, string.Empty, ex.Message);
            }
        }

        public void DeleteFile(string filePath)
        {
            if (File.Exists(filePath))
                File.Delete(filePath);
        }

        public void MoveToSave(DatabaseConfig config, string filePath)
        {
            var saveDir = GetSaveDir(config);
            Directory.CreateDirectory(saveDir);

            if (File.Exists(filePath))
            {
                var dest = Path.Combine(saveDir, Path.GetFileName(filePath));
                File.Move(filePath, dest);
            }
        }

        public void CleanupEmptyDir(DatabaseConfig config)
        {
            var dir = GetBackupDir(config);
            if (Directory.Exists(dir) && !Directory.EnumerateFiles(dir).Any())
                Directory.Delete(dir, recursive: true);
        }
        #endregion

        #region Backups logic
        private async Task<string> BackupPostgres(DatabaseConfig config)
        {
            var filePath = GetBackupFilePath(config);
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "pg_dump",
                    Arguments = $"-h {config.Host} -p {config.Port} -U {config.Username} -d {config.DatabaseName} -F c -f \"{filePath}\"",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    Environment = { ["PGPASSWORD"] = config.Password }
                }
            };

            await RunProcess(process);
            return filePath;
        }

        private async Task<string> BackupMySQL(DatabaseConfig config)
        {
            var filePath = GetBackupFilePath(config);
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "mysqldump",
                    Arguments = $"-h {config.Host} -P {config.Port} -u {config.Username} -p{config.Password} {config.DatabaseName}",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false
                }
            };

            var output = await RunProcess(process);
            await File.WriteAllTextAsync(filePath, output);
            return filePath;
        }

        private async Task<string> BackupMSSQL(DatabaseConfig config)
        {
            var filePath = GetBackupFilePath(config);
            using var connection = new SqlConnection($"Server={config.Host},{config.Port};Database={config.DatabaseName};User Id={config.Username};Password={config.Password};TrustServerCertificate=True");
            await connection.OpenAsync();

            using var command = new SqlCommand($"BACKUP DATABASE [{config.DatabaseName}] TO DISK = '{filePath}'", connection);
            command.CommandTimeout = 3600; // 1 hour
            await command.ExecuteNonQueryAsync();

            return filePath;
        }

        private Task<string> BackupSQLite(DatabaseConfig config)
        {
            var filePath = GetBackupFilePath(config);
            File.Copy(config.Host, filePath, overwrite: true);
            return Task.FromResult(filePath);
        }
        #endregion

        #region Paths
        private string GetBackupDir(DatabaseConfig config) =>
            Path.Combine(_backupsRoot, $"{config.Host}_{config.Port}", config.DatabaseName);

        private string GetSaveDir(DatabaseConfig config) =>
            Path.Combine(_saveRoot, $"{config.Host}_{config.Port}", config.DatabaseName);

        private string GetBackupFilePath(DatabaseConfig config)
        {
            var dir = GetBackupDir(config);
            Directory.CreateDirectory(dir);
            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
            return Path.Combine(dir, $"{config.DatabaseName}_{timestamp}.sql");
        }
        #endregion

        private static async Task<string> RunProcess(Process process)
        {
            process.Start();

            var output = process.StartInfo.RedirectStandardOutput 
                ? await process.StandardOutput.ReadToEndAsync() 
                : string.Empty;

            var error = await process.StandardError.ReadToEndAsync();
            await process.WaitForExitAsync();
            if (process.ExitCode != 0) throw new Exception(error);

            return output;
        }
    }
}
