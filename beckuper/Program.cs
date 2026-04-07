using backuper.Data;
using backuper.Models;
using backuper.Repositories;
using backuper.Services;
using Hangfire;
using Hangfire.Storage.SQLite;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// CORS
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("DevCors", policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });
}

// Data
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=/app/data/backuper.db"
    )
);

// Hangfire
builder.Services.AddHangfire(config => config.UseSQLiteStorage(
    builder.Configuration.GetConnectionString("Hangfire") ?? "/app/data/hangfire.db"
));
builder.Services.AddHangfireServer();

// Repositories
builder.Services.AddScoped<ICRUDRepository<DatabaseConfig>, DatabaseRepository>();
builder.Services.AddScoped<DatabaseRepository>();
builder.Services.AddScoped<ICRUDRepository<BackupRecord>, BackupRepository>();
builder.Services.AddScoped<BackupRepository>();

// Services
builder.Services.AddSingleton<BackupService>();
builder.Services.AddSingleton<AppSettingsService>();
builder.Services.AddSingleton<SchedulerService>();

// Ports
builder.WebHost.UseUrls(
    $"http://*:{Environment.GetEnvironmentVariable("WEB_PORT") ?? "8080"}"
);

var app = builder.Build();

// Migrations + cleanup stale InProgress backups
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();

    await dbContext.Backups
        .Where(b => b.Status == BackupStatus.InProgress)
        .ExecuteUpdateAsync(s => s
            .SetProperty(b => b.Status, BackupStatus.Failed)
            .SetProperty(b => b.ErrorMessage, "Interrupted by application restart"));
}

// Start scheduler after Hangfire server is ready
var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
lifetime.ApplicationStarted.Register(() =>
{
    var scheduler = app.Services.GetRequiredService<SchedulerService>();
    scheduler.ScheduleAllAsync().GetAwaiter().GetResult();
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

if (app.Environment.IsDevelopment())
{
    app.UseCors("DevCors");
}

// Web client
app.UseDefaultFiles();
app.UseStaticFiles();

// API
app.UseAuthorization();
app.MapControllers();

// Web interface fallback
app.MapFallbackToFile("index.html");

app.Run();
