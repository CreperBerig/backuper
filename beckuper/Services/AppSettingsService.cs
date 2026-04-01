using backuper.Models;
using System.Text.Json;

namespace backuper.Services
{
    public class AppSettingsService
    {
        private readonly string _configPath;
        private static readonly JsonSerializerOptions _jsonOptions = new() { WriteIndented = true };

        public AppSettingsService(IConfiguration config)
        {
            var volumeRoot = config["VolumePath"] ?? "/app";
            _configPath = Path.Combine(volumeRoot, "data", "config.json");
        }

        public async Task<AppSettingsData> GetAppSettingsData()
        {
            if(!File.Exists(_configPath))
                return new AppSettingsData();

            var json = await File.ReadAllTextAsync(_configPath);
            return JsonSerializer.Deserialize<AppSettingsData>(json) ?? new AppSettingsData();
        }

        public async Task UpdateAppSetings(AppSettingsData settings)
        {
            var dir = Path.GetDirectoryName(_configPath);
            Directory.CreateDirectory(dir);

            var json = JsonSerializer.Serialize(settings, _jsonOptions);
            await File.WriteAllTextAsync(_configPath, json);
        }
    }
}
