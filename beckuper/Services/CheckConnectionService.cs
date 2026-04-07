using backuper.Models;
using Microsoft.Data.SqlClient;
using MySqlConnector;
using Npgsql;

namespace backuper.Services
{
    public class CheckConnectionService
    {
        public static async Task<bool> PostgreSQL(DatabaseConfig config)
        {
            Console.WriteLine($"PostgreSQL config: {config.ToString()}");
            var pgConn = new NpgsqlConnection($"Host={config.Host};Port={config.Port};Database={config.DatabaseName};Username={config.Username};Password={config.Password};Timeout=5");
            Console.WriteLine("Created PostgreSQL connection.");
            await using (pgConn)
            {
                await pgConn.OpenAsync();
                Console.WriteLine("PostgreSQL connection successful.");
                return true;
            }
            Console.WriteLine("PostgreSQL connection false.");
        }

        public static async Task<bool> MySQL(DatabaseConfig config)
        {
            var myConn = new MySqlConnection($"Host={config.Host};Port={config.Port};Database={config.DatabaseName};Username={config.Username};Password={config.Password};ConnectionTimeout=5");
            await using (myConn)
            {
                await myConn.OpenAsync();
                return true;
            }
        }

        public static async Task<bool> MSSQL(DatabaseConfig config)
        {
            var msConn = new SqlConnection($"Server={config.Host},{config.Port};Database={config.DatabaseName};User Id={config.Username};Password={config.Password};TrustServerCertificate=True;Connect Timeout=5");
            await using (msConn)
            {
                await msConn.OpenAsync();
                return true;
            }
        }

        public static async Task<bool> SQLite(DatabaseConfig config)
        {
            return File.Exists(config.Host);
        }
    }
}
