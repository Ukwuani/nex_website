---
title: Licensing
description: How a gateway is licensed - the 30-day trial, editions and add-ons, activating with a license file or online, licensing edge gateways from the central, and what happens when a subscription ends.
---

Each gateway is licensed on its own, with **unlimited tags, devices and clients**. A redundant pair shares one license. Licenses are checked on the gateway itself, so plants without internet access work the same way as connected ones.

Open **License** in the sidebar (under *System*) to see the gateway's state, what its license includes, and where to add one.

## Trial, licensed, and after

| State | When | What runs |
|---|---|---|
| **Trial** | The first 30 days after install | Everything |
| **Licensed** | A current subscription | The edition's features (below) |
| **Grace period** | After the subscription ends, for its grace days (30 by default) | Everything as before, with a banner |
| **Lapsed** | After the grace period | **The plant keeps running.** Values, alarms, history, views, notifications and connectors carry on unchanged. Engineering changes and script changes are refused for everyone until a renewed license is added; administrators can still add it |
| **Development mode** | Never licensed, after the trial | Engineering works as usual. Drivers, alarms, history, scripts and flows run in 2-hour sessions, which anyone with the *Engineer* permission starts from the banner or the License page |

A lapsed or expired license never stops a running plant. Only a gateway that has never been licensed, and whose trial is over, pauses between development sessions.

## Editions

Drivers, tags, UDT templates, alarms, views and applications, history, trends, scripting and MQTT are in every edition.

| | Edge | Standard | Enterprise |
|---|---|---|---|
| OPC UA server, SQL bridge, webhooks, REST API | | ✓ | ✓ |
| Automation (Node-RED), alarm notifications and on-call, reports | | ✓ | ✓ |
| Single sign-on (OpenID Connect, SAML, Windows directory) | | ✓ | ✓ |
| Central gateway (accepting edge gateways) | | | ✓ |
| Redundancy | | | ✓ |
| AI assistant | add-on | add-on | add-on |

A feature the license doesn't include keeps its settings and can still be configured, and its page says it isn't licensed. It just doesn't run:

- The OPC UA server, webhooks and SQL bridge stay off.
- Notifications aren't sent, and flows and scheduled reports don't start.
- Edge gateways can't connect to it.
- The REST API, the assistant and report generation answer that the feature isn't licensed.
- Without single sign-on, everyone signs in with their Nexus password. Accounts that only use a directory or single sign-on can't sign in until it's licensed again.

Most changes apply as soon as a license is added; nothing restarts.

## Adding a license

A license is issued for the gateway's **install ID**. The ID is created when the gateway first starts and is kept in its database, so restoring a backup keeps the license valid, while a fresh install gets a new ID and a new trial.

### With a license file

This works on any gateway, with or without internet access.

1. On **License**, download the **activation request** (or copy the install ID) and send it to your Nexus supplier.
2. Add the `.nexus-license` file you get back with **Add a license**. You can choose the file or paste its text.

### Online, with an activation key

A gateway that can reach the internet can activate with a key instead:

1. On **License**, choose **Activate online** and enter the activation key from your supplier.
2. The gateway fetches its license, and from then on fetches renewals by itself, asking once a day. **Check for a renewal** asks now.

If the license server can't be reached, the license keeps working and the page says so. The gateway needs outbound HTTPS to the license server.

### Edge gateways

A central gateway licenses its edge gateways for you, over the [gateway network](../gateway-network/):

1. On the central, open **License → Edge gateways** and download the **activation request**. It covers every edge that has connected, with each edge's install ID. Send it to your supplier.
2. Add the file they send back (one license per edge) with **Add licenses**. Each license is installed on its edge straight away if it's connected, or when it next connects. The table shows where each one got to.

An edge keeps a license that lasts longer than the one sent, so an old copy on the central never takes a renewal away. Each edge's license state also shows under **Gateway Network → Edge gateways**.

## Good to know

- Project exports don't include the license. A gateway that imports a project keeps its own.
- Renewing is the same as licensing: add the new file, or, with online activation, it arrives by itself.
- A redundant pair needs one license; both gateways use it.
