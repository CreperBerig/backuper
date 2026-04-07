using System.Text.Json.Serialization;

namespace backuper.Models
{
    public class BackupRecord
    {
        public int Id { get; set; }
        public int DatabaseConfigId { get; set; }
        [JsonIgnore]
        public DatabaseConfig DatabaseConfig { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
        public long SizeBytes { get; set; }
        public BackupStatus Status { get; set; }
        public string FilePath { get; set; } = string.Empty;
        public BackupTrigger Trigger { get; set; }
        public string? ErrorMessage { get; set; }

        override public string ToString()
        {
            return $"BackupRecord(Id={Id}, DatabaseConfigId={DatabaseConfigId}, CreatedAt={CreatedAt}, SizeBytes={SizeBytes}, Status={Status}, FilePath='{FilePath}', Trigger={Trigger}, ErrorMessage='{ErrorMessage}')";
        }
    }
}
