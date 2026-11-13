---
title: Trends
description: Chart historized tags together, move through history, zoom in on an event, and export what you see as CSV.
---

**Trends** charts any historized tags together, live or over any period. Only tags with **Historize** turned on have history (see [Tags](../tags/#history)).

## Making a chart

1. Open **Trends**.
2. Add tags from the tag browser. Each becomes a **pen** with its own colour.
3. Pick a time range: **5m**, **15m**, **1h**, **8h**, **24h** or **7d**.

Pens with the same engineering units share a plot. Pens with different units get their own plot, stacked on the same time axis, so a temperature and a flow can be compared and each keeps its own scale.

## Moving through history

- **Drag across the chart** to zoom into that period.
- **Scroll** over the chart to zoom in and out.
- **Back (undo zoom)** returns to the previous view.
- **Zoom out** widens the period.
- **Earlier** moves back in time.
- **Back to live** returns to the live, scrolling chart.

The arrow keys pan along the time axis. Move the cursor over the chart to read every pen's value at that moment: the pen table under the chart lists each pen's value at the cursor and its minimum, maximum and average over what is shown.

Long ranges are summarised on the gateway, with each interval's minimum-to-maximum range shaded, so short spikes stay visible even over weeks.

## Exporting

**Export CSV** downloads the values of every pen for the period on screen.

## Charts in views

The same chart is available as the **Power chart** symbol in views, so operators can look back without leaving their application. You choose its pens and opening period, and whether operators can add pens of their own. The smaller **Trend** symbol shows up to three tags over a fixed time span. See [Views](../views/#controls-and-data).

## History of other value types

Booleans chart as steps (0 and 1). Text values are recorded too and appear alongside numbers in exports and reports.

## History from edge gateways

On a central gateway, edge gateways' historized tags chart like local ones. History recorded while the link was down arrives when it comes back, so there are no gaps. See [Gateway network](../gateway-network/).
