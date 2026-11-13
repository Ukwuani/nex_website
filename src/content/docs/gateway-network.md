---
title: Gateway network
description: Link gateways at different sites - edge gateways share tags, history and alarms with a central one over one outbound connection - and send tags from one gateway to another.
---

Gateways at different sites, or on different networks, can link up. An **edge** gateway shares its tags with a **central** gateway, which then sees them as its own. Open **Gateway Network**:

| Tab | On | For |
|---|---|---|
| **Edge gateways** | The central | Accepting edges, enrollment tokens, and the edges that are connected |
| **Central links** | An edge | Connecting to a central gateway and choosing what to share |

## How it works

- **Outbound only.** The edge opens one connection to the central gateway's normal HTTPS port. Edges behind NAT or a firewall only need outbound access to the central.
- **Names.** Each gateway's network name (its host name by default) labels its tags elsewhere: tag `line1.speed` on edge `line1-edge` is `@line1-edge/line1.speed` on the central, in a tag provider named after the edge.
- **Edges never relay** other gateways' tags.

## Linking an edge to a central gateway

On the **central** gateway:

1. Open **Gateway Network → Edge gateways** and turn on **Accept edge gateways**.
2. Create an **enrollment token** (administrators only). It is shown once.

On the **edge** gateway:

1. Open **Gateway Network → Central links → New link**.
2. Enter the central's address (`https://central.plant.local:4443`) and the token.
3. Choose what to share (below) and save.

A token binds to the first gateway that uses it. Revoking it disconnects that gateway at once. If the central still has a self-signed certificate, turn off *Verify the central gateway's TLS certificate* on the link until it has a CA-issued one.

## What the central gets

Each link's share settings decide what the edge gives the central:

| Share | The central gets |
|---|---|
| **Tags** (all, or the folders you choose) | The tags and live values, read-only in Tag Explorer and usable everywhere: screens, trends, reports, scripts, expressions, the REST API, its OPC UA server and MQTT publishers. If the link drops they stay with bad quality until it is back |
| **History** | The edge's historized tags, forwarded with their original timestamps. While the central is unreachable, the edge keeps history on disk and sends it in order when the link is back, so there is no gap |
| **Alarms** | The edge's open alarms and every transition. Operators on the central can acknowledge them; the acknowledgement is carried out, and audited, on the edge. Alarm rules stay on the edge |
| **Writes** | *Allow the central gateway to write shared tags* (off by default). Writes are audited on both gateways |
| **Tag transfer** | *Let the central gateway send tags here (with their UDTs, devices and alarms) and copy the shared tags* (off by default; see below) |

Each side shows its peers' state, tag counts, values and history sent and received, and history still waiting.

## Sending tags between gateways

You can copy tag folders from one gateway to another, with the UDT templates, devices, scan classes, alarm rules and tag scripts they use. This is useful for rolling a standard line out to several sites, or bringing an edge's configuration to the central.

### From the central to edges

1. On the edge, turn on **tag transfer** in its central link's share settings.
2. On the central, open **Tag Explorer → Send tags**.
3. Choose the folders, then **Send to edge gateways on the gateway network**, and tick the edges. Edges that are offline or don't allow it are greyed out with the reason.
4. **Preview** asks each edge what it would change, and shows it per edge.
5. **Send** imports the tags on the edges that have changes. They start running there at once.

### From an edge to the central

On the central, open **Gateway Network → Edge gateways** and, for an edge that allows tag transfer:

- **Copy its tags here** opens the import preview for the folders the edge shares, so you can bring them in as the central's own tags under a folder you choose.
- **Download its tags** saves them as a tag package file.

### As a file

**Tag Explorer → Send tags → Download a tag package** saves the folders as a file to import on any Nexus gateway with **Import tags**, even one with no network connection. See [Projects and packages](../projects-and-packages/#tag-packages).

Tag IDs stay the same when tags are sent, so a tag that already exists on the target with the same ID is updated (and moved), not duplicated. Device passwords are not sent; enter them on the target. Bringing tag scripts along needs the *Manage scripts* permission.

## With redundancy

- **A central pair:** list both gateways as the link's addresses. The edge tries them in turn and settles on the active one (a standby refuses the connection).
- **An edge pair:** the active edge holds the link. History it couldn't send yet stays on that machine and is sent when it is active again.

See [Redundancy](../redundancy/).

## Monitoring links

The `nexus_gateway_link_*` and `nexus_remote_gateway_*` metrics carry each link's state and counters (see [Operations](../operations/#monitoring)).
