using beckuper.Data;
using beckuper.Models;
using beckuper.Repositories;
using beckuper.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Data
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=/app/data/beckuper.db"
    )
);

// Repositories
builder.Services.AddScoped<ICRUDRepository<DatabaseConfig>, DatabaseRepository>();
builder.Services.AddScoped<DatabaseRepository>();
builder.Services.AddScoped<ICRUDRepository<BackupRecord>, BackupRepository>();
builder.Services.AddScoped<BackupRepository>();

// Services
builder.Services.AddSingleton<BackupService>();

// Ports
builder.WebHost.UseUrls(
    $"http://*:{Environment.GetEnvironmentVariable("WEB_PORT") ?? "8080"}"
);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
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
