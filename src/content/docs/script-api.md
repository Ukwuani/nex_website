---
title: Script API
description: Reference for the nexus.* scripting API - tags, alarms, history, the database, HTTP, secrets and utilities - and the variables each kind of script gets.
---

Every gateway script, tag script, library module and console run can use the `nexus` object, plus `log`, `console` and `shared`. Functions marked `await` return a promise.

## nexus.tag

Read, write and browse tags.

| Function | Returns |
|---|---|
| `nexus.tag.read(tagId)` | The current `{ tagId, value, quality, timestamp }`, or null if the tag has no value |
| `nexus.tag.readValue(tagId)` | Just the current value, or null |
| `nexus.tag.readAll([tagId, …])` | `read()` for several tags at once |
| `await nexus.tag.write(tagId, value)` | Writes any writable tag: device tags go to the PLC (with scaling removed), memory tags are stored, reference tags write through. Expression tags are read-only |
| `nexus.tag.browse(prefix?)` | Tags whose path or ID starts with `prefix`: `[{ tagId, path, name, tagType, dataType, engineeringUnits }]` |
| `nexus.tag.exists(tagId)` | Whether an enabled tag with this ID exists |

```js
const level = nexus.tag.readValue('plant.t101.level');
if (level > 90) await nexus.tag.write('plant.t101.inletValve', false);
```

## nexus.alarm

| Function | Returns |
|---|---|
| `await nexus.alarm.active()` | Open alarm events, newest first |
| `await nexus.alarm.ack(eventId)` | Acknowledges an alarm event, attributed to the gateway rather than a user |

## nexus.historian

| Function | Returns |
|---|---|
| `await nexus.historian.query(tagId, from, to?)` | History points `[{ ts, value }]`. `from` and `to` are a `Date`, an ISO string or epoch milliseconds |
| `await nexus.historian.aggregate(tagId, minutes, fn = 'avg')` | One value over the last N minutes: `avg`, `min`, `max`, `sum`, `count` or `last` |

```js
const avgFlow = await nexus.historian.aggregate('plant.inlet.flow', 60, 'avg');
```

## nexus.db

| Function | Returns |
|---|---|
| `await nexus.db.query(sql, params?)` | Rows from the gateway's database. Parameterized SQL (`$1`, `$2`…), run in a read-only transaction with a 5-second timeout |

## nexus.net

| Function | Returns |
|---|---|
| `await nexus.net.http({ url, method?, headers?, body?, timeoutMs? })` | An HTTP response `{ status, ok, headers, text, json }`. Object bodies are sent as JSON |

```js
const res = await nexus.net.http({
  url: 'https://mes.plant.local/api/orders',
  method: 'POST',
  body: { line: 1, count: nexus.tag.readValue('plant.line1.count') },
});
if (!res.ok) log('MES refused:', res.status, res.text);
```

## nexus.secret

| Function | Returns |
|---|---|
| `nexus.secret.get('name')` | The secret's value. Throws if there is no such secret. Values are masked (`••••••`) in logs and console results |
| `nexus.secret.has('name')` | Whether the secret exists |

See [Scripting → Secrets](../scripting/#secrets).

## nexus.util

| Function | Returns |
|---|---|
| `nexus.util.now()` | Epoch milliseconds |
| `await nexus.util.sleep(ms)` | Waits, up to 10 seconds |
| `nexus.util.uuid()` | A random UUID |

## Logging and shared code

| Name | Use |
|---|---|
| `log(...values)` | Writes a line to the script log |
| `console.log / warn / error` | Also go to the script log |
| `shared.<module>.<function>` | Functions from the script library |

## Variables by script kind

| Script | Variables |
|---|---|
| Tag script | `value`, `previousValue`, `quality`, `previousQuality`, `timestamp`, `tagId`, `initialChange` |
| UDT template script | The tag script variables, plus `udt.instance`, `udt.prefix`, `udt.member`, `udt.params` |
| Timer, startup, shutdown | None beyond the API |
| Scheduled | `scheduledFor`: when the run was due, as an ISO time |
| Tag change | `tagId`, `value`, `previousValue`, `quality` |
| Alarm | `event` (`{ id, tagId, priority, state, valueAtActivation, activatedAt, … }`), `action` (`activated`, `acked`, `rtn`, `cleared`…) |
| Message handler | `payload`, `user` (`{ id, email, role }`), `view` (`{ viewId, params }` or null), `handler` |
| Library module | `exports`: export non-function values with `exports.NAME = value` |

## Return values

- **Console:** `return` shows a value as the result.
- **Message handler:** the return value goes back to the caller. See [Message handlers](../scripting/#message-handlers).
- Other scripts' return values are ignored.
