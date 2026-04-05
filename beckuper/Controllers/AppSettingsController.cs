using backuper.Models;
using backuper.Services;
using Microsoft.AspNetCore.Mvc;

namespace backuper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppSettingsController : ControllerBase
    {
        private readonly AppSettingsService _appSettingsService;
        private readonly ILogger<AppSettingsController> _logger;

        public AppSettingsController(AppSettingsService appSettingsService, ILogger<AppSettingsController> logger)
        {
            _appSettingsService = appSettingsService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAppSettings()
        {
            var settings = await _appSettingsService.GetAppSettingsData();
            _logger.LogInformation("App settings retrieved successfully. {Settings}", settings);
            return Ok(settings);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAppSettings([FromBody] AppSettingsData settings)
        {
            _logger.LogInformation("New settings: {Settings}", settings);
            await _appSettingsService.UpdateAppSetings(settings);
            _logger.LogInformation("App settings updated successfully. {Settings}", settings);
            return NoContent();
        }
    }
}
