---
title: Operations
description: Look after a running gateway - backups and restores, upgrades, the nexus command line, health endpoints, Prometheus monitoring, and orderly shutdown.
---

## Backups

**PostgreSQL holds everything that matters:** configuration, users, the alarm journal, the audit log and long-term history. QuestDB holds raw history. Back up both, and the gateway's **data directory** too: it holds Node-RED flows and the OPC UA server's certificate and trust list (lose it and every OPC UA client has to trust the server again).

| Install | How |
|---|---|
| **Windows, databases on the gateway** | Automatic: the *Nexus backup* task runs every night at 02:00, keeps the newest 7 database dumps and one copy of QuestDB's data in `C:\ProgramData\Nexus\backups\`. Change where, when and how many with `install.ps1 -BackupDir E:\NexusBackups -BackupTime 01:30 -BackupKeep 14`. Run one now with `Start-ScheduledTask 'Nexus backup'` |
| **Docker** | `nexusctl backup` writes a project file and a full database dump to `backups/<timestamp>/` |
| **Linux and your own servers** | `pg_dump --format=custom` of the `nexus` database, plus your usual QuestDB and file backups |

On Windows the gateway watches its backups: **System Health → Gateway checks** shows the last one, and the *Backup age* alarm goes off when there hasn't been a good one for 26 hours.

> **Keep the keys with the backups, but somewhere else.** Script secrets in a dump are encrypted; restoring them needs the same `NEXUS_SECRETS_KEY` (or `JWT_SECRET` if that isn't set).

Copy backups off the machine. A backup folder on another disk survives losing this one.

A **project export** (see [Projects and packages](../projects-and-packages/)) is a convenient configuration backup too, but it doesn't include history, users or API keys.

### Restoring

- **Docker:** `nexusctl restore backups/<timestamp>` (replaces all configuration and history).
- **Windows, databases on the gateway:** stop the `nexus` service, restore `nexus.dump` with the bundled `pg_restore` into a fresh `nexus` database (with TimescaleDB's pre- and post-restore steps), copy the QuestDB backup over its data folder, and start the services again.
- **Linux and your own servers:** `pg_restore` into a fresh database with TimescaleDB enabled, following TimescaleDB's restore steps.

## Upgrading

Upgrades keep settings and data, and database migrations run automatically when the new version starts.

| Install | Upgrade | Roll back |
|---|---|---|
| Windows | Run the new setup wizard | Run the previous version's setup wizard |
| Linux | Extract the new release and run its `install.sh` | `ln -sfn /opt/nexus/releases/<old> /opt/nexus/current && systemctl restart nexus` |
| Docker | `nexusctl upgrade /path/to/new/release` | Restore the backup taken before upgrading |
| Mac | Replace the app | Replace it with the previous version |

Rolling back only works between versions without new database migrations, so **back up before upgrading**. For a redundant pair, upgrade both gateways to the same version.

## The command line

The `nexus` command is installed with the gateway (Docker: `nexusctl cli ...`). It uses the gateway's own settings file.

| Command | Does |
|---|---|
| `nexus check` | Checks PostgreSQL (and TimescaleDB), both QuestDB ports, the data directory and the port, and says which fails |
| `nexus migrate` | Applies pending database migrations |
| `nexus project export [--out FILE] [--include-secrets]` | Writes the project as JSON |
| `nexus project import FILE [--dry-run]` | Merges a project into this gateway (`-` reads standard input) |
| `nexus admin reset-password EMAIL [--password P]` | Resets a user's password, generating one if omitted |
| `nexus user add EMAIL --role ROLE [--name NAME] [--password P]` | Creates a user |
| `nexus app publish SLUG [--note TEXT]` | Publishes an application's draft |
| `nexus app export SLUG [--out FILE]` | Writes one application as a package |
| `nexus symbols export [--ids 1,2] [--out FILE]` | Writes library symbols as a package |
| `nexus tags export FOLDER... [--out FILE]` | Writes tag folders as a package (`"[provider]/Folder"` for other providers) |
| `nexus package import FILE [--as SLUG] [--name NAME] [--dry-run]` | Imports an application, symbol or tag package |
| `nexus version` | Prints the version |

Running gateways on the same database reload automatically after an import.

## Health endpoints

Both are unauthenticated, for load balancers and orchestrators:

- `GET /health`: the process is up. Includes the version, uptime, and in a pair the role and node name.
- `GET /ready`: PostgreSQL and QuestDB respond (`503` otherwise, and on a standby).

## Monitoring

`GET /metrics` serves Prometheus metrics. It needs a read API key, or set `NEXUS_METRICS_PUBLIC=true` on a trusted network:

```yaml
scrape_configs:
  - job_name: nexus
    authorization:
      credentials: nxk_...          # a read-only API key
    static_configs:
      - targets: ['gateway:4000']
```

Included: process memory, CPU and event-loop lag; tags by type and update rate; per-device connection state; open alarms by priority and state; historian buffers; OPC UA sessions; MQTT, webhook and SQL bridge counters; gateway network links; certificates, disk, clock and backups; HTTP requests; and the gateway's version.

Good first alerts:

- `nexus_device_connected == 0`
- `nexus_historian_backlog > 0` for 10 minutes
- `nexus_historian_dropped_total` increasing
- `nexus_certificate_days_left < 30`
- `up == 0`

## When a database is down

- **QuestDB down:** the gateway still starts and runs. History is buffered to disk and written when QuestDB is back.
- **PostgreSQL down:** configuration changes and sign-ins need it, but a running gateway keeps reading devices, and history is buffered to disk until the database is back.

## Shutdown

Stopping the service shuts down in order: gateway shutdown scripts, drivers, the historian (flushing its buffer), the alarm engine, Node-RED, and finally the database connections.

## Logs

| Install | Where |
|---|---|
| Windows | `C:\ProgramData\Nexus\logs\nexus-service.out.log` |
| Linux | `journalctl -u nexus` |
| Docker | `nexusctl logs nexus` |
| Mac | **Show Logs** in the menu (`~/Library/Logs/Nexus`) |

Raise the log level for a while under **System Health → This gateway** to track a problem down; it applies at once.
