---
title: Installation
description: Install Nexus on Windows, Linux, Docker or a Mac, sign in for the first time, and know which ports to open.
---

Nexus runs as one gateway process plus two databases (PostgreSQL with TimescaleDB, and QuestDB). Choose the installer that suits the machine:

| | Windows installer | Linux installer | Docker installer | Nexus for Mac |
|---|---|---|---|---|
| **For** | Plant servers | Plant servers | Any machine with Docker | Evaluations, demos, training, engineering laptops |
| **Runs on** | Windows 10/11, Windows Server 2016 or later, x64 | Linux with systemd | Linux, macOS, Windows (WSL2) | macOS on Apple Silicon |
| **Databases** | Installed for you, or use your own servers | Bring your own, or start the bundled ones | Included | Included |
| **Needs** | Nothing else (Node.js is included) | Node.js 22.9 or later | Docker with Compose v2 | Nothing else |
| **Managed with** | Windows Services and the `nexus` CLI | `systemctl` and the `nexus` CLI | `nexusctl` | The menu-bar app |

Whichever you choose, upgrades keep your settings and data, and database migrations run automatically when the new version starts.

## Windows

### Before you install

- **The machine:** Windows 10 or 11, or Windows Server 2016 or later, 64-bit, and an administrator account for setup. A suggested starting point is 4 CPU cores and 8 GB of RAM for the gateway alone, or 16 GB with the databases on the same machine, and an SSD with at least 50 GB free (more for long history). Keep 15% of the disk free; the gateway alarms below that.
- **The clock:** keep Windows Time synchronised with the plant's time source. The gateway alarms when its clock drifts.
- **Antivirus:** ask IT to exclude `C:\ProgramData\Nexus\data` and the database folders (`C:\ProgramData\Nexus\databases`) from real-time scanning, which slows databases down.
- **Have ready:** the first administrator's email and password. If you use your own database servers, their PostgreSQL URL (`postgres://nexus:PASSWORD@HOST:5432/nexus`) and the QuestDB host.

### Run the setup wizard

Run `nexus-<version>-windows-x64-setup.exe` as an administrator. It asks for:

1. The install folder (default `C:\Program Files\Nexus`).
2. The databases: install them on this computer (the default), or enter the PostgreSQL URL and QuestDB host of servers you already have.
3. The HTTP port (default 4000, which redirects to HTTPS on 4443), whether to open Windows Firewall, and the first administrator's email and password.

Setup installs the databases (a minute or two), checks both, starts the **Nexus Gateway** service and waits until it is ready. If a database can't be reached yet, setup still finishes and tells you what is wrong; the service keeps retrying every minute.

> **SmartScreen.** The installer is not code-signed yet, so Windows asks for **More info → Run anyway**.

**Unattended install:**

```powershell
nexus-<version>-windows-x64-setup.exe /S /ADMIN_EMAIL=me@plant.com /ADMIN_PASSWORD=... [/PORT=4000] [/NOFIREWALL] [/D=D:\Nexus]
```

Add `/DATABASE_URL=postgres://nexus:PASS@db1:5432/nexus /QUESTDB_HOST=db1` to use existing database servers. Put `/D` last.

### Where things are

| Path | Contents |
|---|---|
| `C:\Program Files\Nexus\` | The program, its own Node.js, and the bundled databases |
| `C:\ProgramData\Nexus\nexus.env` | Settings and secrets, kept across upgrades |
| `C:\ProgramData\Nexus\data\` | Node-RED flows, store-and-forward buffers, OPC UA certificates |
| `C:\ProgramData\Nexus\logs\` | The gateway's logs |
| `C:\ProgramData\Nexus\backups\` | Nightly database backups (when the databases are on this computer) |

The service runs as the virtual account `NT SERVICE\nexus`. With the databases on this computer, they run as the services **Nexus PostgreSQL** and **Nexus QuestDB**, listening on 127.0.0.1 only, and a nightly backup task runs at 02:00. See [Operations](../operations/#backups).

### Upgrade, roll back, uninstall

- **Upgrade:** run the new version's setup wizard. It keeps settings and data and migrates on start.
- **Roll back:** run the previous version's setup wizard. This only works between versions without new database migrations.
- **Uninstall:** *Apps → Nexus → Uninstall*. Settings and data are kept unless you tick *Also delete the settings, data and logs*; the local databases are kept unless you also tick *Also delete the databases*.

## Linux

The Linux release installs the gateway as a hardened systemd service. It needs Node.js 22.9 or later and a PostgreSQL (with TimescaleDB) and QuestDB it can reach.

```bash
tar xzf nexus-<version>-linux-x64.tar.gz
cd nexus-<version>-linux-x64
sudo ./install.sh --database-url postgres://nexus:PASSWORD@db-host:5432/nexus \
                  --questdb-host db-host
```

No databases yet? The release includes `databases.yml`: `POSTGRES_PASSWORD=... docker compose -f databases.yml up -d` starts TimescaleDB and QuestDB bound to localhost.

| Path | Contents |
|---|---|
| `/opt/nexus/current` | The active release |
| `/etc/nexus/nexus.env` | Settings and secrets, kept across upgrades |
| `/var/lib/nexus` | Node-RED flows, store-and-forward buffers, OPC UA certificates |
| `/usr/local/bin/nexus` | The CLI |

- **Upgrade:** extract the new release and run its `install.sh`.
- **Roll back:** `ln -sfn /opt/nexus/releases/<old> /opt/nexus/current && systemctl restart nexus` (only between versions without new migrations).
- **Uninstall:** `sudo ./install.sh --uninstall`; add `--purge` to remove settings and data too. Databases are never touched.
- **Serial devices (Modbus RTU):** uncomment `SupplementaryGroups=dialout` in `/etc/systemd/system/nexus.service`, then `systemctl daemon-reload && systemctl restart nexus`.

## Docker

The Docker installer runs the gateway, TimescaleDB and QuestDB with Docker Compose:

```bash
./deploy/install.sh
```

It asks for an install directory, a port and the first admin password (or pass `--yes` to accept defaults and generate a password), writes generated secrets to `<dir>/.env`, starts the stack and prints the URL and sign-in details. Useful options: `--port`, `--opcua-port`, `--admin-email`, `--admin-password`, `--with-mqtt` (adds a broker), `--image` (run a prebuilt image).

Only the gateway's ports are published; the databases are reachable only on the stack's private network. Manage the install with `nexusctl` in the install directory:

| Command | Does |
|---|---|
| `nexusctl status` | Containers and gateway readiness |
| `nexusctl logs [nexus\|postgres\|questdb]` | Follow logs |
| `nexusctl start` / `stop` / `restart` | Control the stack |
| `nexusctl cli ...` | Run the `nexus` CLI inside the gateway |
| `nexusctl backup` | Project file and full database dump into `backups/<timestamp>/` |
| `nexusctl restore backups/<timestamp>` | Restore a dump (replaces all configuration and history) |
| `nexusctl upgrade /path/to/new/release` | Upgrade and restart |
| `nexusctl uninstall [--purge]` | Remove the containers (`--purge` deletes the data too) |

For a serial port, pass it through in `docker-compose.yml`: `devices: ["/dev/ttyUSB0:/dev/ttyUSB0"]` and `group_add: ["dialout"]`.

## Nexus for Mac

`nexus-<version>-macos-arm64.dmg` holds **Nexus.app**, a menu-bar app that runs the whole gateway and its databases for the person signed in to the Mac. No Docker and no admin rights are needed. It is meant for evaluations, demos, training and engineering laptops; use the Windows or Linux installer for plant servers.

1. Open the disk image and drag **Nexus** to Applications.
2. Open it. The first start creates the databases, starts everything, opens the web app and shows the first administrator's sign-in details. You can see them again later under **Sign-in Details…** in the menu.

The menu also has **Open at Login**, **Show Logs** and **Show Data Folder**. Settings live in `~/Library/Application Support/Nexus/nexus.env`. By default only this Mac can reach the web app; to let other machines in, set `HOST=0.0.0.0` there and reopen Nexus. To update, replace the app (the data folder is kept). It runs on Apple Silicon only.

## Signing in for the first time

Open the gateway in a browser:

- Windows and new installs: `https://<gateway>:4443` (port 4000 redirects there).
- Docker and Linux with HTTPS off: `http://<gateway>:4000`.
- Nexus for Mac: the app opens it for you at `http://localhost:4000`.

Sign in with the first administrator's email and password. If no password was given, one was generated: the installer printed it, and it is stored as `NEXUS_ADMIN_PASSWORD` in the settings file.

The gateway starts with a self-signed certificate, so browsers warn about it. That is fine while commissioning; replace it with one from your certificate authority before the plant uses it (see [Connectivity → HTTPS](../connectivity/#https)).

Then:

1. Change the administrator's password from the account menu, and remove `NEXUS_ADMIN_PASSWORD` from the settings file.
2. Set the gateway's public address under **System Health → This gateway**, so links in alarm emails and QR labels point to the right place.
3. Follow the [Quick start](../quick-start/).

## Ports

| Direction | Port | For |
|---|---|---|
| Into the gateway | 4443/tcp | The web app, REST API, live values and gateway network, over HTTPS |
| Into the gateway | 4000/tcp | Redirects to HTTPS and answers health checks (or everything, with HTTPS off) |
| Into the gateway | 4840/tcp | The OPC UA server, if enabled |
| From the gateway | 502, 102, 44818, 9600, 4840, 1883/8883 | Devices and brokers: Modbus TCP, Siemens S7, EtherNet/IP, Omron FINS, OPC UA, MQTT |
| From the gateway | 5432, 8812, 9000 | PostgreSQL and QuestDB, when they run on another machine |
| From the gateway | 587/465, 443 | Optional: email, SMS, the AI assistant, webhooks |

## If the gateway won't start

Run `nexus check` (Docker: `nexusctl cli check`). It tries PostgreSQL (and that TimescaleDB is installed and loaded), both QuestDB ports, the data directory and the port, using the gateway's own settings, and says which one fails. See [Troubleshooting](../troubleshooting/).
