---
title: Notifications and on-call
description: Tell people about alarms by email, SMS or webhook, cover nights and weekends with schedules, rosters and escalation policies, and let people acknowledge from the message.
---

Nexus has two ways to tell people about an alarm, both under **Alarms**:

- **Notification routes** attached to a rule notify straight away when it activates.
- **Escalation policies** tell whoever is on call, then someone else if nobody acknowledges.

## Before you start: email and SMS

- **Email** needs a mail server: set it under **Connectivity → Email** (see [Connectivity](../connectivity/#email)).
- **SMS** needs a Twilio account: set it under **Connectivity → SMS** (see [Connectivity](../connectivity/#sms)).

Without them, those notifications are logged as failed with the reason (*email isn't set up on this gateway*). Webhooks need nothing extra.

## Notification routes

Under **Alarms → Notification routes**, create a route for each destination:

| Type | Sends |
|---|---|
| **Email** | To addresses or people |
| **SMS** | To phone numbers in international format |
| **Webhook** | A JSON POST to a URL, for a chat tool, a ticketing system or a flow |

Then attach routes to rules in the **Routes** column of **Alarms → Rules**, or to alarm templates in a UDT.

## On-call

The **On-call** tab covers who is responsible when.

### Schedules

A schedule is a set of weekly windows in a time zone, for example *Mon-Fri 07:00-19:00*. A window that ends at or before its start runs past midnight (*19:00-07:00*), and *00:00-00:00* is the whole day.

### Rosters

A roster lists people, each on call **always** or **while a schedule is active**. It tells either everyone on call or only the first in order.

### Escalation policies

A policy is a list of steps, timed from the alarm's activation, for example:

- **At once:** the *Operators* roster.
- **After 15 minutes:** the *Engineering* roster.
- **After 45 minutes:** the plant manager's notification route.

Each step goes to a roster or a notification route. A policy stops when someone acknowledges (unless you turn that off), and always when the alarm returns to normal, clears or is shelved. Optionally, everyone already told hears when it clears.

Attach policies per rule in the **Escalate** column, or per alarm in a UDT template (by name).

Escalation survives restarts and failover. Each notification is logged, so a restarted gateway carries on from the next step and doesn't repeat any.

## People's contact settings

Everyone chooses how they are reached under **account menu → Notification settings**: email, SMS to an international number, or off for holidays. They can send themselves a test, once a minute.

Administrators can set anyone's contact details under **Users**, and on the On-call tab see who is reachable and send anyone a test.

## Acknowledging from the message

Notifications include a link to the alarm:

- The link works for 24 hours and acts as the person it was sent to.
- Opening it only shows the alarm. Acknowledging takes a click, with an optional note, so mail scanners that follow links can't acknowledge by accident.

Links use the gateway's **public address** (System Health → This gateway). Set it to the address people can actually reach, especially from their phones.

## Webhooks with more control

A webhook route posts each alarm transition to its URL. For signed deliveries with retries, batching, and value changes as well as alarms, use **Connectivity → API & webhooks** instead (see [REST API and webhooks](../rest-api/#webhooks)).

## History

Every notification sent, and every failure with its reason, appears in the alarm's timeline in the journal. Changes to routes, schedules, rosters, policies and people apply at once. Projects carry schedules, rosters (members by email), policies and which rules use them.
