namespace backuper.Models
{
    public class BackupRecord
    {
        public int Id { get; set; }
        public int DatabaseConfigId { get; set; }
        public DatabaseConfig DatabaseConfig { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
        public long SizeBytes { get; set; }
        public BackupStatus Status { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public BackupTrigger Trigger { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
