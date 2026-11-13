---
title: Quick start
description: From an empty gateway to a live operator screen with an alarm and a trend in about fifteen minutes, using the built-in simulator.
---

This walk-through builds a small tank monitoring screen. It uses the built-in **simulator**, so you need no PLC. When the real equipment is connected later, you only change where the tags read from; screens, alarms and history keep working.

You need an account with the **engineer** or **admin** role.

## 1. Add a simulator device

1. Open **Devices** in the sidebar and choose **Add device**.
2. Name it `sim` and choose the protocol **Simulator (built in - no PLC needed)**.
3. Leave the scan rates as they are and save.

The device appears in the list as connected. A simulator makes values up inside the gateway: waves, random walks, counters, or memory that holds what you write.

## 2. Create tags

1. Open **Tag Explorer** and choose **New folder**. Call it `Tank101`.
2. Select the folder and choose **New tag**:
   - **Name:** `Level`, **Tag type:** device, **Device:** `sim`
   - **Signal:** `sine`, **Min:** `0`, **Max:** `100`, **Period (s):** `120`
   - **Units:** `%`, and turn **Historize** on.
3. Add a second tag, `Setpoint`, of tag type **memory** with the initial value `80` and units `%`.
4. Add a third tag, `HighLevel`, of tag type **expression**, data type boolean, with the expression:

   ```
   {tank101.level} > {tank101.setpoint}
   ```

   Each tag's **Tag ID** is made from its folder and name in lower case, so `Tank101/Level` is `tank101.level`. Use **Insert tag reference** to pick ids instead of typing them.

Select the folder: the values update live.

## 3. Build a view

1. Open **Views**. The application bar at the top shows the default application, **Operations**.
2. Choose **New view**, call it `Tank 101`, and open it.
3. From the palette, drag a **Tank** onto the canvas. In the property panel on the right, set its tag to `tank101.level`.
4. Drag a **Setpoint** control next to it and set its tag to `tank101.setpoint`. Operators can now type a new limit.
5. Drag an **Indicator**, bind it to `tank101.highlevel`, and give it the caption `High level`.
6. Save. Choose **Open in viewer** to try it: the tank fills and empties, and the indicator lights above the setpoint.

## 4. Publish it to operators

1. In the application bar, open **Settings** and add a navigation item that opens the `Tank 101` view. Make it the home view.
2. Choose **Publish**, write a note such as *First tank screen*, and publish.
3. Open `/apps/operations` in a new tab (or on a tablet). This is the full-screen client operators use.

Engineers' changes stay in a draft until someone publishes them. See [Applications](../applications/).

## 5. Add an alarm

1. Open **Alarms → Rules** and choose **Add rule**.
2. Pick the tag `tank101.level`, type **hi**, setpoint `90`, priority **high**, and save.
3. Within two minutes the sine wave passes 90. The alarm appears in the ribbon at the top of the application and in **Alarms → Journal**.
4. Acknowledge it from the ribbon or the journal, optionally with a note.

To get an email or text when it trips, set up email or SMS under **Connectivity**, then attach a notification route to the rule. See [Notifications and on-call](../notifications-and-on-call/).

## 6. Look at the history

Open **Trends**, pick `tank101.level`, and choose a range such as **15m**. Drag across the chart to zoom in, and use **Export CSV** to download what you see.

## Where to go next

- Connect real equipment: [Devices](../devices/).
- Model repeated equipment once: [UDT templates](../udt-templates/).
- Make richer screens with popups, repeaters and your own symbols: [Views](../views/) and [Symbol library](../symbol-library/).
- Send a shift report every morning: [Reports](../reports/).
