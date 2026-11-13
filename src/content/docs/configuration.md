---
title: Configuration reference
description: Every setting in the gateway's settings file - databases, ports and HTTPS, secrets, redundancy, resource limits, Node-RED, email and SMS fallbacks.
---

Most of Nexus is configured in the web app. A few settings belong to the machine and live in the gateway's **settings file**:

| Install | Settings file |
|---|---|
| Windows | `C:\ProgramData\Nexus\nexus.env` |
| Linux | `/etc/nexus/nexus.env` |
| Docker | `<install dir>/.env` |
| Mac | `~/Library/Application Support/Nexus/nexus.env` |

Edit it as an administrator, then restart the gateway (Windows: `Restart-Service nexus`; Linux: `systemctl restart nexus`; Docker: `nexusctl restart`; Mac: quit and reopen). Real environment variables override the file, and an empty value counts as unset. Invalid settings stop the gateway with a list of what is wrong.

## Databases

| Variable | |
|---|---|
| `DATABASE_URL` | **Required.** PostgreSQL connection string; the database needs TimescaleDB |
| `QUESTDB_PG_URL` | **Required.** QuestDB's PostgreSQL-wire URL for reads, e.g. `postgres://admin:quest@host:8812/qdb` |
| `QUESTDB_HTTP_URL` | **Required.** QuestDB's HTTP URL, e.g. `http://host:9000` |
| `QUESTDB_ILP_CONF` | **Required.** QuestDB's ingest settings for writes, e.g. `http::addr=host:9000;` |

## Network and HTTPS

| Variable | Default | |
|---|---|---|
| `PORT` / `HOST` | `4000` / `0.0.0.0` | Where the gateway listens. With HTTPS on, `PORT` only redirects |
| `NEXUS_HTTPS` | `true` for installers | Serve over HTTPS on `NEXUS_HTTPS_PORT` |
| `NEXUS_HTTPS_PORT` | `4443` | The HTTPS port |
| `NEXUS_TLS_CERT_FILE` / `NEXUS_TLS_KEY_FILE` | | PEM files managed outside Nexus. Unset: Nexus keeps the certificate itself |
| `NEXUS_HTTP_REDIRECT` | `true` | With HTTPS: `PORT` redirects and answers health checks. `false`: nothing listens on `PORT` |
| `NEXUS_PUBLIC_URL` | | Where people reach this gateway. **System Health → This gateway** takes precedence |
| `NEXUS_TRUST_PROXY` | off | Behind a reverse proxy: `true`, a hop count, or the proxy's addresses, so client addresses are real |

## Secrets and accounts

| Variable | Default | |
|---|---|---|
| `JWT_SECRET` | | **Required.** 16+ random characters. Changing it signs everyone out |
| `NEXUS_SECRETS_KEY` | derived from `JWT_SECRET` | Encrypts stored secrets (16+ characters). Set it so secrets stay readable if `JWT_SECRET` ever changes; identical on both gateways of a pair |
| `NEXUS_ADMIN_EMAIL` | `admin@nexus.local` | The first administrator, created only when there are no users |
| `NEXUS_ADMIN_PASSWORD` | generated | The first administrator's password (8+ characters). Remove it after the first sign-in |

## Redundancy

| Variable | Default | |
|---|---|---|
| `NEXUS_REDUNDANCY` | `false` | Active/standby pair on a shared database |
| `NEXUS_NODE_NAME` | host name | This gateway's name in a pair (must differ per gateway) and on the gateway network |
| `NEXUS_FAILOVER_SECONDS` | `15` | Heartbeat silence before a standby takes over from a hung active |

## Health checks

| Variable | Default | |
|---|---|---|
| `NEXUS_NTP_SERVER` | | Time server the clock check compares with; the database server's clock otherwise. Also under System Health → This gateway |
| `NEXUS_BACKUP_STATUS` | Windows with local databases: set by setup | Status file of the backup task, which adds the backup check and alarm |
| `NEXUS_METRICS_PUBLIC` | `false` | Serve `/metrics` without an API key |
| `NEXUS_LOG_LEVEL` | `info` | `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent`. Also under System Health → This gateway, at once |

## Resource limits

| Variable | Default | |
|---|---|---|
| `NEXUS_WATCHDOG_SECONDS` | `30` in production | Main thread blocked this long and the gateway restarts (0 = off) |
| `NEXUS_MEMORY_LIMIT_PERCENT` | `90` | Memory use at which the gateway restarts itself in an orderly way |
| `NEXUS_SCRIPT_MEMORY_MB` | `512` | Memory limit of the script worker |
| `NEXUS_DRIVER_ISOLATION` | `native` | Drivers run in the separate driver host: `native` (S7, Modbus RTU), `all`, or `off` |
| `NEXUS_NODE_RED_MEMORY_MB` | `1024` | Memory limit of the Node-RED process |
| `NEXUS_NODE_RED_BLOCKED_SECONDS` | `15` | Node-RED silent this long and it is restarted |
| `NEXUS_NODE_RED_INSTALLS` | `off` | What Node-RED may install from npm: `off`, `on`, or a list of module names. See [Node-RED](../node-red/#installing-extra-nodes) |

## Paths

| Variable | Default | |
|---|---|---|
| `NEXUS_DATA_DIR` | set by the installer | Runtime data: Node-RED flows, store-and-forward buffers, certificates |
| `NEXUS_AUTO_MIGRATE` | `true` | Apply database migrations at startup |

## Fallbacks for settings in the app

These are easier to set in the web app, which takes precedence:

| Variable | In the app |
|---|---|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Connectivity → Email |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` | Connectivity → SMS |
| `ANTHROPIC_API_KEY` | Connectivity → AI assistant |
