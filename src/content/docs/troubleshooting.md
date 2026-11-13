---
title: Troubleshooting
description: Answers to common problems - the gateway won't start, a device won't connect, values look wrong, notifications don't arrive, and more.
---

## The gateway won't start

Run `nexus check` (Docker: `nexusctl cli check`). It tries everything the gateway needs, with the gateway's own settings, and says which part fails:

| Message | Fix |
|---|---|
| PostgreSQL can't be reached | Start the database, or correct `DATABASE_URL` in the settings file |
| *TimescaleDB is installed but not loaded* | Add `timescaledb` to `shared_preload_libraries` in `postgresql.conf` and restart PostgreSQL |
| QuestDB can't be reached | Start QuestDB, or correct the `QUESTDB_*` settings |
| The port is in use | Another program has port 4000 or 4443; stop it or change `PORT` / `NEXUS_HTTPS_PORT` |
| An invalid setting | The message lists what is wrong in the settings file |

On Windows, if setup finished but a database wasn't ready, the service keeps retrying every minute: fix the problem and it starts on its own.

## I can't sign in

- **Forgot the administrator password:** `nexus admin reset-password admin@plant.com` (Docker: `nexusctl cli admin reset-password ...`) prints a new one.
- **Locked out after wrong passwords:** wait 15 minutes, or sign in from another computer.
- **"The password could not be checked":** no Active Directory / LDAP server answered. Check the servers in the provider's settings and the network path to them.
- **Everyone was signed out:** `JWT_SECRET` changed.

## The browser warns about the certificate

The gateway starts with a self-signed certificate. Install one from your certificate authority under **Connectivity → HTTPS** (see [Connectivity](../connectivity/#https)).

## A device won't connect

1. Check the address and port, and that the gateway machine can reach the device (`ping`, or `Test-NetConnection host -Port 502` on Windows).
2. Check a firewall isn't blocking the port between them.
3. **Modbus:** check the unit ID. **S7:** check rack and slot, and allow PUT/GET in the PLC. **Omron FINS over UDP:** check the node numbers. **OPC UA:** check the endpoint URL.
4. **Serial ports:** check the service may open the port (`dialout` on Linux, `LocalSystem` on Windows, the device passed through in Docker) and the baud rate, parity and stop bits.

## Some tags are bad quality

Tag Explorer shows each bad tag's reason:

- **Address rejected:** the device doesn't have that register or data block. Correct the address; other tags keep working.
- **Read timing out:** the device is slow or overloaded. Increase the timeout, or move tags to a slower scan class.
- **Device offline:** see *A device won't connect* above.

## Values look wrong

- **A float reads as a huge or tiny number:** try another byte order, usually `CDAB`. See [Devices](../devices/#modbus-addresses).
- **Off by one register:** Nexus addresses are one-based as in device manuals (`40001` is the first holding register). If the manual counts from zero, add one.
- **Wrong engineering units:** check the tag's scaling.

## An alarm didn't notify anyone

Open the alarm in **Alarms → Journal**: its timeline lists every notification sent, and failed ones with the reason.

- *Email isn't set up on this gateway:* set the mail server under **Connectivity → Email**, then use **Send test**.
- An SMTP error such as `535 Authentication failed`: check the user name and password; Microsoft 365 and Gmail need SMTP AUTH or an app password.
- Nobody on call: check the roster's schedule and people's **Notification settings**.

## Links in alarm emails or QR labels don't work

They use the gateway's public address. Set it under **System Health → This gateway** to the address people and phones can reach, not `localhost`.

## The camera scan button doesn't work

Browsers only allow the camera on secure pages: the gateway needs HTTPS with a certificate the device trusts. See [Barcode and QR scanning](../barcode-scanning/#the-camera).

## Operators don't see my changes

Changes to views are part of the application's **draft**. Publish the application (see [Applications](../applications/#drafts-publishing-and-versions)). Open screens switch to the new version within a minute.

## A save in the view editor was refused

Someone else saved the view after you opened it. The editor says who and when; load their version, or save over it.

## Writes are refused

- **"Read only" or no write control:** your role lacks *Operate*, or the tag or its folder limits writes to other roles. See [Tags](../tags/#who-may-write-a-tag).
- **409 from the API or a banner in the app:** you are on the standby gateway of a redundant pair. Use the active one.
- **Expression and query tags** can never be written.

## History has gaps

- Check the tag has **Historize** on, and its history deadband isn't too large.
- If QuestDB was down, history was buffered on disk and is written when it comes back.
- For edge gateways, history waiting to be sent shows on the link; it arrives when the link is back.

## A script stopped

Open **Scripting → Log**. A script that loops for 5 seconds or runs out of memory is stopped, with the reason logged. **System Health → Isolation and self-healing** shows worker restarts.

## Node-RED is in safe mode

A flow stopped Node-RED three times in two minutes. Open **Automation**, fix or disable the flow, and deploy.

## Still stuck?

Raise the log level under **System Health → This gateway**, reproduce the problem, and look at the gateway's log (see [Operations](../operations/#logs)). Then send the log, and the steps that cause the problem, to whoever supports your installation.
