---
title: REST API and webhooks
description: Read and write tags, history and alarms from other systems with API keys and the REST API v1, and push alarm and value events out with signed webhooks.
---

Other systems can read and write the gateway through the **REST API v1**, and receive events through **webhooks**. Both are under **Connectivity → API & webhooks**.

## API keys

Administrators create keys under **Connectivity → API & webhooks**.

- A key is shown **once**; only a hash of it is stored.
- **Read** keys can call every GET endpoint. **Write** keys can also write values, acknowledge alarms and call message handlers.
- Keys can expire, and can be revoked at once.
- Each key is limited to 50 requests a second (bursts of 200).

Send the key in a header:

```
Authorization: Bearer nxk_...
```

or

```
X-API-Key: nxk_...
```

## Endpoints

| Method and path | Does |
|---|---|
| `GET /api/v1/tags` | Lists tags |
| `GET /api/v1/tags/{id}` | One tag's definition |
| `GET /api/v1/values?tagIds=a,b` | Current values, quality and timestamps |
| `GET /api/v1/history` | History of a tag over a period |
| `GET /api/v1/alarms` | Active alarms |
| `POST /api/v1/values` | Writes a value: `{"tagId": "...", "value": ...}` |
| `POST /api/v1/alarms/{id}/ack` | Acknowledges an alarm |
| `POST /api/v1/messages/{handler}` | Runs a message handler script with `{"payload": {...}}` and returns its result |

The **OpenAPI 3.1** description is at `/api/v1/openapi.json` (no key needed). Import it into Postman or a client generator for every parameter and response.

### Examples

```bash
# Read two values
curl -H "Authorization: Bearer $KEY" \
  "https://gateway:4443/api/v1/values?tagIds=demo.level,demo.setpoint"

# Write a setpoint
curl -X POST -H "Authorization: Bearer $KEY" -H 'content-type: application/json' \
  -d '{"tagId":"demo.setpoint","value":55}' \
  https://gateway:4443/api/v1/values

# Call a message handler
curl -X POST -H "Authorization: Bearer $KEY" -H 'content-type: application/json' \
  -d '{"payload":{"order":"WO-1042"}}' \
  https://gateway:4443/api/v1/messages/start-order
```

Writes are checked against tag write permissions and audited as `api-key:<name>`. A standby gateway refuses writes with `409`.

## Webhooks

A webhook POSTs events to a URL, batched (every 1 second by default):

- **Alarm transitions:** activated, acknowledged, returned to normal, cleared…
- **Value changes** of tags under chosen folders.

```json
{
  "webhook": "Ops alarm feed",
  "deliveryId": "…",
  "sentAt": "…",
  "events": [
    { "type": "alarm", "action": "activated", "alarm": { "id": 42, "tagId": "…", "priority": "high" } },
    { "type": "tag", "tagId": "demo.setpoint", "path": "Demo/Water/Setpoint", "value": 55, "quality": "good", "timestamp": "…" }
  ]
}
```

### Verifying the sender

With a **signing secret**, each request carries `X-Nexus-Signature: sha256=<hex HMAC-SHA256 of the raw body>`. Check it on the receiving side:

```js
const expected = Buffer.from('sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex'));
const received = Buffer.from(req.headers['x-nexus-signature'] ?? '');
const valid = received.length === expected.length && crypto.timingSafeEqual(received, expected);
```

### Retries

Network errors, `429` and `5xx` responses are retried after 1, 5 and 30 seconds; other responses aren't. Webhooks are notifications, not a guaranteed log: the queue is held in memory (up to 10,000 events per webhook).

## Other ways in

- **OPC UA** and **MQTT** for industrial clients (see [Connectivity](../connectivity/)).
- **MCP** for AI clients (see [AI assistant](../ai-assistant/#mcp-server-for-other-ai-clients)).
- **Prometheus metrics** at `/metrics` with a read key (see [Operations](../operations/#monitoring)).
