namespace beckuper.Models
{
    public class AppSettingsData
    {
        public int RetryCount { get; set; } = 3;
        public int RetryDelayMinutes { get; set; } = 30;
    }
}
