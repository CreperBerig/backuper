# Backuper

A self-hosted database backup manager with a web UI. Supports scheduled and manual backups for PostgreSQL, MySQL, MSSQL, and SQLite databases.

**Docker Hub:** [hub.docker.com/r/creperberig/backuper](https://hub.docker.com/r/creperberig/backuper)

## Features

- **Multiple database engines** — PostgreSQL, MySQL, MSSQL, SQLite
- **Scheduled backups** — per-database cron schedule (e.g. `0 2 * * *` for daily at 2:00 AM)
- **Manual backups** — trigger a backup on demand from the UI
- **Retention policy** — automatic deletion of backups older than a configured number of days
- **Retry on failure** — configurable retry count and delay between attempts
- **Backup history** — view all backup records with status, size, trigger type, and error messages
- **Download backups** — download any backup file directly from the UI
- **Prometheus metrics** — exposed at `/metrics`
- **REST API** — documented via Scalar at `/scalar`

## Quick Start with Docker Compose

The example below starts Backuper alongside a PostgreSQL instance for testing.

```yaml
services:
  backuper:
    image: creperberig/backuper:latest
    container_name: backuper
    ports:
      - "8080:8080"     # Web UI & API
      - "9090:9090"     # Prometheus metrics
    volumes:
      - backuper-data:/app/data       # SQLite app database & Hangfire
      - backuper-backups:/app/backups # Backup files
    environment:
      - ConnectionStrings__DefaultConnection=Data Source=/app/data/backuper.db
      - ConnectionStrings__Hangfire=/app/data/hangfire.db
      - VolumePath=/app
    restart: unless-stopped

  postgres-test:
    image: postgres:16-alpine
    container_name: beckuper-postgres-test
    environment:
      POSTGRES_DB: testdb
      POSTGRES_USER: testuser
      POSTGRES_PASSWORD: testpassword
    ports:
      - "5433:5432"
    restart: unless-stopped

volumes:
  backuper-data:
  backuper-backups:
```

Start it:

```bash
docker compose up -d
```

Open the UI at [http://localhost:8080](http://localhost:8080).

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `ConnectionStrings__DefaultConnection` | Path to the app SQLite database | `Data Source=/app/data/backuper.db` |
| `ConnectionStrings__Hangfire` | Path to the Hangfire SQLite database | `/app/data/hangfire.db` |
| `VolumePath` | Root directory for backups and data | `/app` |

## Database Configuration

Each database entry has:

| Field | Description |
|---|---|
| Name | Friendly label |
| Type | `PostgresSQL`, `MySQL`, `MSSQL`, or `SQLite` |
| Host / Port | Connection target |
| Database name | Name of the database to back up |
| Username / Password | Credentials |
| Cron schedule | When to run automatic backups (default: `0 2 * * *`) |
| Retention days | How many days to keep backups (default: 7) |

## Global Settings

Configurable via the UI under Settings:

| Setting | Description | Default |
|---|---|---|
| Retry count | How many times to retry a failed backup | 3 |
| Retry delay | Minutes between retries | 30 |
| Cleanup cron | Schedule for purging old backups | `0 3 * * *` |

## Tech Stack

- **Backend:** ASP.NET Core (.NET 10)
- **Frontend:** React + TypeScript
- **Scheduling:** Hangfire
- **Metrics:** prometheus-net
- **App storage:** SQLite (via EF Core)
