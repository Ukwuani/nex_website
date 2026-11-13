---
title: Sign-in providers
description: Let people sign in with company accounts through OpenID Connect, SAML 2.0 or Active Directory / LDAP, with group-to-role mapping.
---

People can sign in with company accounts instead of, or as well as, Nexus passwords. **Users → Identity providers** holds any number of providers, each with its own group-to-role mapping:

| Type | How people sign in | Typical providers |
|---|---|---|
| **OpenID Connect** | A *Sign in with …* button | Microsoft Entra ID, Okta, Google Workspace, Keycloak, Authentik |
| **SAML 2.0** | A *Sign in with …* button | Entra ID, ADFS, Okta, Shibboleth, PingFederate |
| **Active Directory / LDAP** | The normal sign-in form: `jdoe`, `CORP\jdoe` or `jdoe@corp.local` and their Windows password | Active Directory, OpenLDAP, FreeIPA, 389 DS |

Buttons appear on the sign-in page in the list's order (the arrows reorder them), and directories are asked in that order too.

## Settings every provider has

- **Who gets which role.** The first group someone is in decides their role. *Everyone else* gets a default role or is refused. Accounts a provider creates follow its groups at every sign-in, and are refused once no group admits them. Existing accounts with the same email are linked and keep the role you gave them.
- **Create accounts on first sign-in**, or only let in people you added (matched by email).
- **Try it** checks the settings before you save. OpenID Connect reads the provider's discovery document; SAML reads the certificate; a directory signs a person in without starting a session and shows their DN, email, groups and the role they would get.

Secrets (client secrets, the directory's service account password) are never sent back to the browser; saving the form unchanged keeps them.

### Nexus passwords

*Who may sign in with a Nexus password: only administrators* makes everyone else use a provider, while administrators keep a password way in for when a provider is down. Directory passwords are not affected.

> **Behind a proxy?** Set the gateway's public address (System Health → This gateway) so the addresses providers send people back to use the public address.

## OpenID Connect

1. In the provider, register a web application (a confidential client) with the **redirect URI** shown in Nexus: `https://<gateway>/api/auth/oidc/callback`.
2. In Nexus, enter the **issuer URL**, client ID and secret. Saving checks the provider's discovery document.
3. Map groups to roles. Groups come from the claim you name (`groups` by default; dotted names reach nested claims such as Keycloak's `realm_access.roles`). Entra ID sends group object IDs unless you configure app roles (claim `roles`).

| Provider | Issuer URL |
|---|---|
| Microsoft Entra ID | `https://login.microsoftonline.com/<tenant-id>/v2.0` |
| Okta | `https://<org>.okta.com/oauth2/default` |
| Google | `https://accounts.google.com` |
| Keycloak | `https://<host>/realms/<realm>` |

## SAML 2.0

1. Add the provider: paste its **metadata URL or XML** (Entra ID: *App Federation Metadata Url*; ADFS: `https://<adfs>/FederationMetadata/2007-06/FederationMetadata.xml`) to fill in the sign-in URL, entity ID and signing certificate, or enter them by hand. During a certificate rollover, paste both certificates.
2. Save. Nexus then shows what to register with the provider:
   - **Reply URL (ACS):** `https://<gateway>/api/auth/saml/<id>/acs`
   - **Identifier (entity ID):** `https://<gateway>/api/auth/saml/<id>`
   - or give it the gateway's metadata: `https://<gateway>/api/auth/saml/<id>/metadata`
3. Map groups to roles. Without attribute names set, Nexus reads the usual ones for email, name and groups (Entra's `groups` and `role` claims, ADFS's `Group`, `memberOf`, eduPerson's `isMemberOf`).

Assertions must be signed. Sign-ins are only accepted in answer to a request this gateway sent, in the browser that started it; unsolicited responses and replays are refused.

## Active Directory / LDAP

People type their directory username and password into the normal sign-in form; the directory checks the password, and Nexus never stores it.

1. **Servers:** `ldaps://dc1.corp.local:636`, one per line; the next is tried when one doesn't answer. Use LDAPS, or `ldap://` with **StartTLS**. If the domain controllers' certificates come from an internal CA, paste that CA's certificate.
2. **Base DN** (`DC=corp,DC=local`) and, for Active Directory, the **domain** (`CORP`), so `CORP\jdoe` works.
3. **Service account** (optional): an account that may read users and groups. Nexus finds the person, reads their groups, then checks their password. Without one, Active Directory is asked to check the person directly.
4. Map groups to roles by **name** (`Plant Operators`) or full **DN**. Active Directory's nested groups count.

Accounts are matched by the directory's unique ID, so renames don't create new accounts. Active Directory's own refusals (expired password, disabled account) are passed on. If no directory answers, the sign-in page says the password could not be checked rather than that it is wrong.

OPC UA clients can sign in with the same directory usernames and passwords.
