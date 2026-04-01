using beckuper.Models;
using Microsoft.EntityFrameworkCore;

namespace beckuper.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Models.DatabaseConfig> Databases { get; set; }
        public DbSet<Models.BackupRecord> Backups { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DatabaseConfig>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Host).IsRequired();
                entity.Property(e => e.DatabaseName).IsRequired();
                entity.Property(e => e.Username).IsRequired();
                entity.Property(e => e.Password).IsRequired();
                entity.Property(e => e.CronSchedule).IsRequired();
            });

            modelBuilder.Entity<BackupRecord>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FilePath).IsRequired();

                entity.HasOne(e => e.DatabaseConfig)
                        .WithMany(d => d.Backups)
                        .HasForeignKey(e => e.DatabaseConfigId)
                        .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
