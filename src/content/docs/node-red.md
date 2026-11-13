---
title: Node-RED automation
description: Wire automation flows in the embedded Node-RED editor with Nexus nodes for tags, alarms and notifications, and control what it may install.
---

**Automation** is the Node-RED flow editor, embedded in Nexus. Use it to wire logic visually: react to tag changes, call web services, transform data, send notifications.

It is restricted to administrators, because flows run with the gateway's privileges.

## The Nexus nodes

Nexus nodes come first in the palette:

| Node | Does |
|---|---|
| **tag in** | Emits a message when a tag changes |
| **tag out** | Writes the incoming value to a tag |
| **alarm in** | Emits a message on alarm transitions, with the alarm event |
| **alarm ack** | Acknowledges the alarm event in the message |
| **notify** | Sends an alarm event through one notification route, using the same email, SMS and webhook channels as automatic notifications |

Writes, acknowledgements and notifications go through the gateway like any other, with the same checks and audit log.

Function nodes can read tag values with `global.get('tagRuntime')`, which offers `getValue`, `getAllValues` and `subscribe`.

## The editor

The editor follows Nexus's look and its light/dark choice. Node-RED's welcome tours, telemetry and update prompts are off: Node-RED is updated with Nexus. Deploy flows with the **Deploy** button as usual.

Flow endpoints (HTTP-in nodes) are served under `/red-nodes`.

## Installing extra nodes

The palette manager and function nodes' *Setup → Modules* can pull npm packages onto the gateway, so by default nothing can be installed. Nodes and modules already installed keep working.

To allow some, an administrator lists them in the gateway's settings file and restarts:

```bash
NEXUS_NODE_RED_INSTALLS=node-red-contrib-modbus,node-red-contrib-s7,@flowfuse/*
```

Wildcards match a prefix (`@flowfuse/*`). With a list, the palette manager installs and updates only those, and function nodes can add only those modules. `NEXUS_NODE_RED_INSTALLS=on` allows anything. Because this is set in the settings file and not in the web app, a stolen administrator session can't open it up.

## Reliability

Node-RED runs in its own process, so a misbehaving flow can't stop the gateway:

- If Node-RED dies, runs out of memory, or goes silent (a flow stuck in a loop), it is restarted and its flows start again.
- **Safe mode:** if it stops 3 times in 2 minutes (a flow that hangs it on start), it starts with the editor only and flows held back, so you can fix the flow and deploy.
- In a redundant pair, flows run on the active gateway only.

Node-RED flows are kept in the gateway's data directory: back it up along with the database (see [Operations](../operations/#backups)).
