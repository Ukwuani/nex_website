---
title: Redundancy
description: Run two gateways as an active/standby pair on a shared database, so the standby takes over within seconds if the active one fails.
---

Two gateways can run as a **pair** on the same PostgreSQL and QuestDB. One is **active** and runs everything: drivers, alarms, history, scripts, Node-RED flows, the OPC UA server and publishers. The other is a **standby** that serves the web app and API but runs none of it. If the active fails, the standby takes over.

## Setting up a pair

On both gateways, in the settings file:

```bash
NEXUS_REDUNDANCY=true
NEXUS_NODE_NAME=gw-a                 # gw-b on the other one
NEXUS_PUBLIC_URL=https://gw-a.plant.local:4443
DATABASE_URL=postgres://nexus:...@db-host:5432/nexus     # the same database
QUESTDB_PG_URL=...                                       # the same QuestDB
JWT_SECRET=...                       # identical on both, so sign-ins survive a failover
NEXUS_SECRETS_KEY=...                # if set: identical on both, so scripts can read secrets
```

Run the same Nexus version on both. Both gateways need databases they can both reach, so use database servers of their own rather than databases installed on one of the gateways. The Linux installer suits this best.

## How it behaves

- **Election:** one gateway holds a lock in the database and is active. The lock is released the moment the active process exits or crashes.
- **Failover:** the standby tries for the lock every 2 seconds and takes over as soon as it gets it: within seconds of a crash, immediately on a clean shutdown. If the active **hangs** (its heartbeat stops for 15 seconds by default), the standby takes over too.
- **On taking over,** the new active loads open alarms, memory tag values and configuration from the database, starts its drivers and resumes history, so operators see the same alarms and setpoints. Startup scripts run.
- **Configuration** made on either gateway is saved to the shared database, and the other reloads it at once.
- **Writes on the standby** (tag writes, alarm acknowledgements, message handler calls) are refused, and the web app shows a banner linking to the active gateway.
- **A gateway that finds another active** (it was cut off or frozen while the other took over) stops, and its service restarts it as a standby.

## Load balancers and virtual IPs

`/ready` returns `503` on the standby, so point health checks at `/ready` and traffic follows the active gateway. `/health` reports each gateway's role and name.

## Clients

- Devices see one client at a time: the active gateway.
- OPC UA clients should list both gateways' endpoints.
- MQTT Sparkplug hosts see a new birth message from the new active.
- Edge gateways should list both central gateways as their link's addresses (see [Gateway network](../gateway-network/#with-redundancy)).

## What a pair doesn't cover

If the shared database itself goes down, the active keeps running (nobody can take over without the database). A network split in which only the active loses the database lets both run until it reconnects, so give both gateways a reliable path to the database.

**System Health** shows both gateways, their roles and heartbeats.
