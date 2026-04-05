using backuper.Data;
using backuper.Models;
using backuper.Repositories;
using backuper.Services;
using Hangfire;
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
builder.Services.AddHangfire(config => config.UseInMemoryStorage());
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

// Migrations
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

// Start scheduler
var scheduler = app.Services.GetRequiredService<SchedulerService>();
await scheduler.ScheduleAllAsync();

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
