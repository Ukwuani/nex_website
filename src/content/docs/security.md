---
title: Security
description: A checklist for securing a Nexus gateway, and how sign-in, permissions, transport, secrets, scripts and the audit log protect the plant.
---

## Checklist

Work through this list before a gateway goes into use on the plant:

1. **Change the first administrator's password**, then remove `NEXUS_ADMIN_PASSWORD` from the settings file.
2. **Keep HTTPS on** (the installers turn it on) and **install a certificate from your certificate authority** under Connectivity → HTTPS. See [Connectivity](../connectivity/#https).
3. **Give people the least access they need.** Use the built-in roles, or custom roles, and asset scopes for contractors. See [Users and roles](../users-and-roles/).
4. **Only grant *Manage scripts* and *Administer* to people you would give shell access.** Scripts and Node-RED run code with the gateway's privileges.
5. **Use company accounts** through a sign-in provider, and consider allowing Nexus passwords for administrators only. See [Sign-in providers](../sign-in-providers/).
6. **Decide who opens each screen.** Limit applications to roles, give views that only some people should see access rules, and only make an application public when everything its visitors can see may be seen by anyone who reaches the gateway, choosing the assets they see. See [Applications](../applications/#who-sees-what).
7. **Restrict who may write.** Make folders read-only, or limit writes to certain roles, where operators shouldn't change values. See [Tags](../tags/#who-may-write-a-tag).
8. **OPC UA:** prefer *SignAndEncrypt* beyond a trusted network, trust client certificates one by one, and leave anonymous access off unless every client on the network may read tags.
9. **MQTT:** only turn on *Accept writes* with broker access control that limits who can publish.
10. **API keys:** use read keys where writing isn't needed, give keys an expiry, and revoke ones that are no longer used.
11. **Set `NEXUS_SECRETS_KEY`** and keep it, with `JWT_SECRET`, somewhere safe away from the backups.
12. **Behind a reverse proxy,** set `NEXUS_TRUST_PROXY` so sign-in throttling and logs see real client addresses.
13. **Back up** the database and the data directory, and copy backups off the machine. See [Operations](../operations/#backups).

## Sign-in and sessions

- Passwords are stored as Argon2 hashes.
- Wrong passwords are throttled per account and address, OPC UA sign-ins likewise, and invalid API keys per address.
- Disabling a user, changing their role or signing them out applies to open sessions within seconds.
- Sign-ins through OpenID Connect use PKCE and verify the ID token; SAML assertions must be signed and answer a request the gateway sent.

## Permissions everywhere

Every way in (the web app, applications, the REST API, OPC UA, MQTT, scripts, Node-RED and the MCP server) goes through the same roles and tag write permissions, and every write and acknowledgement is audited with who did it and how.

## Public applications

A [public application](../applications/#public-applications) opens without signing in. Visitors get a pass for that one application: every other part of the gateway, its other applications and its API refuse it. Visitors only look (no writes, acknowledgements or gateway scripts), see only views without access rules, and see only the assets an administrator chose, with only what a screen shows of each tag, never device addresses, expressions or write roles. Only administrators can make an application public, and turning it off locks visitors out at once.

## Transport

- HTTPS with TLS 1.2 or later, and HSTS once a CA-issued certificate is installed.
- Session cookies are marked `Secure` over HTTPS.
- Edge gateways connect to the central over HTTPS, outbound only.
- Every response carries hardening headers, and the web app a strict, same-origin Content Security Policy.

## Secrets

- Device, notification, MQTT, webhook, database, email, SMS and AI credentials are never shown again once saved, and project exports redact them by default.
- Script secrets are encrypted at rest and masked in script output.
- API keys are stored as hashes and shown only once.

## Code that runs on the gateway

- Scripts run in a separate worker with a memory limit; a runaway script is stopped without stopping the plant.
- Widgets in the symbol library, and views' scripts, run sandboxed, with no network access and no access to the page or the user's sign-in. View styles can't load anything from elsewhere or cover the rest of the application.
- Imported SVG symbols are cleaned of scripts and external references.
- Node-RED installs nothing from npm unless the settings file allows it.

## The audit log

The audit log records sign-ins, account and role changes, configuration changes, tag writes (and whether they came from the web, an API key, OPC UA, MQTT or a script), alarm acknowledgements, imports, message handler calls and AI requests. It outlives the configuration: renaming or deleting a tag, rule or user doesn't change what was recorded.
