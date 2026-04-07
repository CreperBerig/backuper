using backuper.Models;
using Synx;

namespace backuper.Services
{
    public class AppSettingsService
    {
        private readonly string _configPath;
        private readonly ILogger<AppSettingsService> _logger;

        public AppSettingsService(IConfiguration config, ILogger<AppSettingsService> logger)
        {
            var volumeRoot = config["VolumePath"] ?? "/app";
            _configPath = Path.Combine(volumeRoot, "data", "config.synx");
            _logger = logger;
        }

        public async Task<AppSettingsData> GetAppSettingsData()
        {
            if(!File.Exists(_configPath))
            {
                _logger.LogWarning("Config file not found at {ConfigPath}. Returning default settings.", _configPath);
                return new AppSettingsData();
            }

            var synx = await File.ReadAllTextAsync(_configPath);
            _logger.LogInformation("Config file read successfully from {ConfigPath}.", _configPath);
            return SynxFormat.Deserialize<AppSettingsData>(synx) ?? new AppSettingsData();
        }

        public async Task UpdateAppSetings(AppSettingsData settings)
        {
            var dir = Path.GetDirectoryName(_configPath);
            Directory.CreateDirectory(dir);

            var synx = SynxFormat.Serialize(settings);
            await File.WriteAllTextAsync(_configPath, synx);
        }
    }
}
