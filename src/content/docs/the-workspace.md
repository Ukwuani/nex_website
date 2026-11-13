---
title: The workspace
description: Find your way around the Nexus web app - the sidebar, the command palette, the account menu, light and dark mode, and what each role sees.
---

The Nexus web app is where engineers and administrators configure the gateway, and where everyone can see views, alarms, trends and reports. Operators usually work in a full-screen [application](../applications/) instead.

## The sidebar

Sections are grouped by what you do with them:

| Group | Section | What it is for |
|---|---|---|
| **Operate** | Views | Process graphics, applications and the symbol library |
| | Alarms | The alarm journal, rules, notification routes, on-call and performance |
| | Trends | Charts of historized tags |
| | Reports | Alarm and shift reports, custom report templates and schedules |
| **Engineer** | Devices | Connections to PLCs, meters, OPC UA servers, MQTT nodes and the simulator |
| | Tag Explorer | The tag tree: folders, tags, providers, CSV import and export |
| | UDT Templates | Reusable equipment types and their instances |
| | Assets | The ISA-95 equipment hierarchy |
| | Scripting | Gateway scripts, the script library, secrets and the console |
| | Automation | The embedded Node-RED editor |
| **System** | Connectivity | OPC UA server, MQTT, API and webhooks, SQL bridge, email, SMS, HTTPS, AI assistant |
| | Gateway Network | Links between edge and central gateways |
| | System Health | Readiness, gateway checks, isolation, redundancy and this gateway's settings |
| | Project | Export and import the whole configuration |
| | Users | Users, roles and identity providers |

You only see sections your role can use. For example, Scripting needs the *Manage scripts* permission, and Users and Automation need *Administer*. See [Users and roles](../users-and-roles/).

The sidebar collapses to icons (the toggle at its foot), and on a phone it becomes a menu.

## The command palette

Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (<kbd>⌘</kbd> + <kbd>K</kbd> on a Mac) anywhere to jump to a section by typing part of its name. It matches on related words too: typing `modbus` finds Devices, and `sso` finds Users.

## The top bar

- **Alarm ribbon.** The newest alarm, with a link to the Alarms page. On these engineering pages it shows the gateway's *system* alarms by default; change that under **Alarms → Performance → Alarm ribbon in the gateway**.
- **Light and dark mode.** Choose light, dark or *System* (follow the computer's setting).
- **Account menu.** Your name and role, **Notification settings** (how alarm notifications reach you), **Change password**, and **Sign out**.

## Banners you may see

- **Standby.** In a redundant pair, the standby gateway shows a banner linking to the active one. You can look around on a standby, but writes and alarm acknowledgements are refused there. See [Redundancy](../redundancy/).
- **Draft.** Views you are editing belong to the draft of their application until someone publishes it.

## Links you can share

Most pages have their own address, so you can bookmark them or send them to a colleague. For example, `/?view=reports&tab=history` opens report history, and `/apps/operations/12?pump=plant.p101` opens view 12 of the Operations application for pump P-101.

## Live values

Values update live over a WebSocket connection. If the connection drops (a network blip, a gateway restart), the app reconnects on its own, and values whose source is unavailable show as bad quality rather than stale numbers.
