---
title: AI assistant
description: Describe a screen and let the assistant draft it from your real tags, set it up with your own API key, know exactly what leaves the plant, and connect other AI clients through the MCP server.
---

Engineers describe a screen, for example *"an overview of every pump with its running state and fault"*, and the assistant builds it from the plant's real tags as a **draft view**, or changes the view open in the editor.

## Using it

- **Views → Design with AI** starts a new view from a description.
- **AI** in the view editor changes the view you have open: *"add the discharge pressure under each pump"*, *"make the tank levels bigger"*.

The panel shows each step as the assistant works: the tags it searched, the folders it looked at, the view it created or changed. Closing the panel stops it at once.

## What it can and can't do

Its abilities are fixed by its tools. It can:

- Search tags, with their current values.
- Browse tag folders.
- List library symbols, applications and views, and read a view.
- **Create or update draft views.**

It can't publish, write tag values, or change devices, alarms, scripts or users. An engineer reviews the draft and publishes it like any other change. It only binds tags it found; a tag that doesn't exist comes back to it as a warning to fix. It only sees views inside your asset scope.

## Setting it up

Administrators set it up under **Connectivity → AI assistant**:

1. Turn it on.
2. Paste an Anthropic API key. It is stored encrypted and never shown again. (Or set `ANTHROPIC_API_KEY` in the settings file.)
3. Choose the model:

| Model | |
|---|---|
| Claude Opus 5.5 (default) | Most capable, best screens |
| Claude Sonnet 5.5 | Fast and capable, about half the price |
| Claude Haiku 5.5 | Fastest and cheapest, for small changes |

**Effort** trades thoroughness for speed and tokens (default high).

## What leaves the plant

The engineer's requests, and the tags (IDs, paths, current values), symbols and views the assistant reads, are sent to Anthropic's Claude API over HTTPS. The gateway needs internet access to `api.anthropic.com`.

- Usage is billed to the API key's account; the panel shows the tokens each request used.
- Every request is in the audit log, with the tools it used and the views it created or changed.
- A request stops after 25 steps.

Nothing is sent unless an engineer uses the assistant.

## MCP server for other AI clients

The gateway is also a [Model Context Protocol](https://modelcontextprotocol.io) server at `/api/mcp`, so AI clients such as Claude Desktop, Claude Code or your own agents get the same tools. For example:

```bash
claude mcp add --transport http nexus https://gateway.plant.local:4443/api/mcp \
  --header "Authorization: Bearer nxk_..."
```

- Authenticate with an API key from **Connectivity → API & webhooks** (see [REST API](../rest-api/#api-keys)).
- A **read** key gets the read tools. The draft-view tools need a **write** key, and the key acts with its creator's access, so its creator must have the *Engineer* permission.
- Every tool call that changes a view is audited with the key's name.
- Requests from other web sites are refused.
