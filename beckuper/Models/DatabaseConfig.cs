 namespace backuper.Models
{
    public class DatabaseConfig
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DatabasesType Type { get; set; }
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; }
        public string DatabaseName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public int RetentionDays { get; set; } = 7; // Default retention period of 7 days
        public string CronSchedule { get; set; } = "0 2 * * *"; // Default to daily at 2:00 AM

        public List<BackupRecord> Backups { get; set; } = [];

        public override string ToString()
        {
            return $"ID: {Id}, Name: {Name}, Type: {Type}, Host: {Host}, Port: {Port}, DatabaseName: {DatabaseName}, Username: {Username}";
        }
    }
}
