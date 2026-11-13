---
title: Views
description: Build operator screens - the view editor, symbols and controls, bindings and transforms, actions, popups, parameters, repeaters, layouts for every screen size, and keyboard shortcuts.
---

A **view** is one screen of live process graphics: tanks, pumps and valves, values, buttons, setpoints, charts and tables, bound to tags. Views belong to an [application](../applications/), which publishes them to operators.

Open **Views** to see the views of the application selected in the bar at the top. From there:

- **New view** creates one.
- **Open** shows a view live, as an operator would see it.
- The edit button opens the **view editor**.
- **Design with AI** asks the [AI assistant](../ai-assistant/) to draft one from your tags.
- **Symbol library** manages your own symbols (see [Symbol library](../symbol-library/)).

## The view editor

The editor has three parts:

- **The palette** on the left: symbols grouped as *Process*, *Controls & data* and *Layout*, then your library symbols.
- **The canvas** in the middle, where you place and arrange symbols.
- **The property panel** on the right, for the selected symbol. With nothing selected, it shows the view's own settings: name, asset, parameters, layout, barcode scans and alarm ribbon.

Drag a symbol from the palette onto the canvas, then set its **tag** in the property panel. Most symbols have a main tag that drives their main property: a tank's level, a pump's running state, a value's number. Save with the save button; the view is part of the application's draft until it is published.

If someone else saved the same view after you opened it, your save is refused and the editor says who saved it and when. You can load their version or save over it.

## Symbols

### Process

Tank, Pump, Valve, Motor, Fan, Heat exchanger, Conveyor, Instrument, Compressor, Filter and Agitator. Each has properties such as *running*, *fault*, *level* or *open*, a caption, and colours that follow the view's style.

### Controls and data

| Symbol | Shows or does |
|---|---|
| **Value** | A live number or text, with units and format |
| **Indicator** | A lamp for an on/off state |
| **Button** | Runs an action when clicked (see [Actions](#actions)) |
| **Setpoint** | A numeric entry that writes a tag, within a min and max |
| **Drop-down** | Picks one of several values and writes it |
| **Toggle switch** | Writes true/false |
| **Slider** | Writes a number by dragging |
| **Text field** | Writes text (and takes barcode scans) |
| **Trend** | A small live chart of up to three tags over a time span |
| **Power chart** | A full chart with several pens and history navigation, like the Trends page; operators can add pens if you allow it |
| **Analog bar** | A bar for a value in its scale, with low-low, low, high and high-high marks |
| **Alarm list** | Active operator alarms, filtered by asset or tag prefix |
| **Tag table** | Live values of every tag in a folder |
| **Data table** | The rows of a dataset tag |

### Layout

| Symbol | Use |
|---|---|
| **Text** | Labels and titles |
| **Shape** | Backgrounds and areas, with a fill, a title and an optional dashed outline |
| **Image** | A picture, such as a plant photo or a logo |
| **Pipe** and **Pipe joint** | Connect symbols. A pipe has a size, the medium it carries, an arrow, and **Flowing** (bindable) to animate flow |
| **Menu** | The application's navigation, placed inside the view |
| **Embedded view** | Another view inside this one, with its own parameters |
| **Repeater** | One view repeated for several instances (see [Repeaters](#repeaters)) |

Every symbol has width, height, rotation, a caption and **Visible**, which can itself be bound, to hide a symbol until it matters.

## Bindings

Any property marked as bindable can be driven by a **binding** instead of a fixed value. Choose the binding kind next to the property:

| Kind | The property follows |
|---|---|
| **Tag** | A live tag value |
| **Expression** | A calculation over tags, using the [expression language](../expressions/) |
| **History** | An aggregate of a tag's history over the last N minutes: average, minimum, maximum or last |
| **Parameter** | One of the view's parameters |
| **Symbol** | Another symbol's property, as it shows |

### Transforms

A binding can pass its value through a **transform** before the property gets it:

- **Value map:** rows that turn a value into what the property needs. `0` → *Stopped*, `1` → *Running*, `2` → *Fault*, or a level range → a colour. Each row matches an exact value (*equals*) or a numeric range. The first matching row wins; with no match the fallback applies, otherwise the value passes through.
- **Format:** a number format and suffix: `#,##0.0` and ` bar`.
- **Expression:** an expression where `{value}` is the bound value, and other tags and functions may join it: `if({value} > 80, "#d33", "#2a2")`.

## Actions

Buttons and most symbols can run an **action** when clicked:

| Action | Does |
|---|---|
| **Write a value** | Writes a fixed value to the symbol's tag or another tag |
| **Toggle** | Flips a boolean tag |
| **Open a view** | Navigates to another view, with parameter values |
| **Open a popup** | Opens a view in a floating window |
| **Close popup** | Closes the popup the symbol is in |
| **Run a gateway script** | Calls a message handler script with a payload (see [Scripting](../scripting/#message-handlers)) |

Write, toggle, navigate and script actions can **Ask first**: a confirmation such as *Start pump ${pump}?* before the action runs. Writes are checked against the operator's role and the tag's write roles. Operators without permission see controls as read-only.

A message handler can answer the operator: return text to show it, or `{ message, severity, navigate, popup }` to show a message and open a view.

## Popups

**Open a popup** shows a view in a floating window over the current one: a pump faceplate over the overview. Settings:

- **View** and its parameter values.
- **Title**, **Width** and **Height**.
- **Position:** a window in the middle, or a full-height panel along the left or right side.
- **Modal:** dims and blocks the view behind it until closed. With *close on outside click*, a click outside closes it.
- **Resizable**, and whether it shows its title bar.

Operators can drag popups, and <kbd>Esc</kbd> closes the top one.

## Parameters

A view can declare **parameters**, each with a default, and use them as `${name}` in any text field: tag IDs, captions, expressions, action values. One faceplate view then serves every pump:

- A tank symbol bound to `${pump}.level`.
- A navigation item or button opens the view with `pump = plant.p101`.

Parameters can come from navigation items, popup and navigate actions, embedded views, repeaters, scan actions and the view's own URL (`/apps/operations/12?pump=plant.p101`).

## Repeaters

A **Repeater** shows one view many times, in rows, a column or a wrapping grid:

- **A list I type in:** each item with its parameter values.
- **One per subfolder of a tag folder:** for example one card per pump folder under `Plant/Pumps`. Each subfolder's shared tag ID prefix (`plant.pumps.p101`) is passed as the parameter you name, and optionally the folder name too. A new pump folder then appears on screen without editing the view.

Set the item width and height, and the gap between items.

## Layout and screen sizes

The view's **Layout** settings decide how it fills the screen:

| Mode | Behaviour |
|---|---|
| **Canvas** | Symbols stay where you placed them, and the whole view is scaled: **Fit the screen**, **Fit the width (scrolls down)** or **Actual size (scrolls)**. Best for process graphics and P&IDs. |
| **Flow** | Symbols are laid out like a web page, in rows or a column that wraps, so the screen reflows on a tablet or phone. |
| **Page** | A layout of rows, columns, grids, cards and tabs holding symbols and process canvases. Best for dashboards and forms. |

For phones:

- **On narrow screens show** another view, given the same parameters: a phone layout of the same screen. Set the width it applies below (phones are under 600 px, tablets under 1000).
- **Hide on screens narrower than** on a symbol leaves out detail a phone doesn't need.

### Style

| Style | Look |
|---|---|
| **High performance** (the default) | Grey equipment, with colour only for what is abnormal, following ISA-101 |
| **Classic** | Colourful equipment |

Views follow the light or dark theme of the screen they are on.

## Arranging symbols

Select several symbols with a drag or <kbd>Shift</kbd>-click, then use the arrange bar to align them (left, centre, right, top, middle, bottom), space them evenly across or down, group them, and bring them to the front or send them to the back.

### Keyboard shortcuts

| Keys | Does |
|---|---|
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | Undo |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> or <kbd>Ctrl</kbd> + <kbd>Y</kbd> | Redo |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> / <kbd>X</kbd> / <kbd>V</kbd> | Copy, cut, paste (also between views) |
| <kbd>Ctrl</kbd> + <kbd>D</kbd> | Duplicate |
| <kbd>Ctrl</kbd> + <kbd>G</kbd> | Group |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd> | Ungroup |
| <kbd>Backspace</kbd> | Delete the selection (or **Delete** in the arrange bar) |

On a Mac, use <kbd>⌘</kbd> instead of <kbd>Ctrl</kbd>.

## Alarm ribbon and barcode scans

With nothing selected, the property panel also has:

- **Alarm ribbon:** what the ribbon over this view shows in its application: the alarms of this view's asset (the default when the view has one), all operator alarms, or no ribbon. See [Applications](../applications/#alarm-ribbons).
- **Barcode scans:** what a barcode or QR scan does while this view fills the screen. See [Barcode and QR scanning](../barcode-scanning/).

## Trying a view

**Open** (or **Open in viewer** from the editor) shows the view live with real values, so you can try buttons, popups and scans. Writes are real, so take care on a running plant. **QR code** makes a printable label that opens this view on a phone or scanner.

## Moving views between gateways

Views travel inside their application: export the application as a package, or the whole configuration as a project. See [Projects and packages](../projects-and-packages/).
