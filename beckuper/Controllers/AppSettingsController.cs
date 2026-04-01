using beckuper.Models;
using beckuper.Services;
using Microsoft.AspNetCore.Mvc;

namespace beckuper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppSettingsController : ControllerBase
    {
        private readonly AppSettingsService _appSettingsService;

        private AppSettingsController(AppSettingsService appSettingsService)
        {
            _appSettingsService = appSettingsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAppSettings()
        {
            var settings = await _appSettingsService.GetAppSettingsData();
            return Ok(settings);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAppSettings([FromBody] AppSettingsData settings)
        {
            await _appSettingsService.UpdateAppSetings(settings);
            return NoContent();
        }
    }
}
