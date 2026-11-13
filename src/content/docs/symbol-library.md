---
title: Symbol library
description: Import your own SVG symbols and animate them from tags, or write sandboxed widgets with their own behaviour - then use them in views like the built-in ones.
---

The **symbol library** holds symbols you make yourself: P&ID symbols, machines, a plant layout drawn in a vector editor, or **widgets** written in HTML, CSS and JavaScript. Library symbols appear in the view editor's palette under their *palette group* and work like built-in symbols: they have properties, bindings, captions, rotation and click actions.

Open it from **Views → Symbol library**.

## Importing an SVG drawing

Draw the symbol in Inkscape, Illustrator or any tool that saves SVG, then choose **Import SVG**.

1. **The drawing is cleaned** before it is stored. Scripts, event handlers, embedded HTML, images and links to other files are taken out (the editor lists what was removed), and `<style>` rules are applied to the elements they style, so one symbol can't restyle the page or another symbol. Drawings can be up to 512 KB and 5,000 elements.
2. **Add properties:** the values views set or bind to tags, for example `running` (on/off), `level` (a number), `state`, or a colour. Mark one as the **main property**: it is driven by the symbol's main tag and written by its click actions.
3. **Add animations** that connect a property to part of the drawing. Pick the part by clicking it in the preview (it needs an `id` in the SVG) or name a `.class`.
4. **Try it:** drive the preview with test values before saving.
5. Give it a name and a palette group, and save.

### Animations

| Animation | Does |
|---|---|
| **Colour** | Sets the fill and/or outline from the value: a colour such as `#22c55e`, or `success`, `warning`, `error`, `primary`, `muted`, which follow light and dark mode. On a group, every shape in it changes |
| **Show / hide** | Shows the part while the value is true |
| **Blink** | Blinks the part while the value is true |
| **Spin** | Turns the part about its own centre while true, such as an impeller |
| **Rotate** | Turns the part to an angle: a value range maps to an angle range, such as a damper |
| **Fill level** | Fills the part to the value's share of a range, upwards, downwards or sideways, such as a tank |
| **Text** | Writes the value into a `<text>` element, with decimals and units |

Any animation can **map values** first: state `2` → `error`, or a level below 10 → shown.

## Writing a widget

When a drawing isn't enough (a chart, a batch timeline, a control with its own behaviour), write a **widget**. **New widget** starts from a working example: a process value bar with a setpoint slider.

A widget is markup, style and a script, with properties like any symbol. Its script uses one object, `nexus`:

| `nexus.` | Use |
|---|---|
| `props` | The property values now |
| `onChange(fn)` | Calls `fn(props)` now and on every change |
| `write(prop, value)` | Writes the tag the view binds to `prop`. Only for properties marked **Writable**, only as that property's type, and at most 10 writes a second |
| `action()` | Runs the click action the view gave the symbol |
| `theme` | `{ mode, colors }`. The colours are also CSS variables: `var(--nx-text)`, `--nx-muted`, `--nx-primary`, `--nx-success`, `--nx-warning`, `--nx-error`, `--nx-surface`, `--nx-surface-2`, `--nx-border` |
| `editing` | `true` while it is being placed in the view editor (writes do nothing there) |
| `log(...)` | Shows in the symbol editor's console, with errors |

```js
const bar = document.querySelector('.bar');
nexus.onChange((props) => {
  bar.style.height = `${props.value}%`;
});
document.querySelector('button').addEventListener('click', () => nexus.write('setpoint', 50));
```

### Widgets are sandboxed

Each widget runs in an isolated frame that may run scripts but has no origin of its own and no network access. A widget can't read the Nexus page, the user's sign-in or cookies, use storage, call the API or load anything from outside. All it gets is its properties. All it can do is ask for a write through a writable property bound to a tag (checked again by the view and done with the operator's own permissions) or for the symbol's click action.

Engineers who write widgets are trusted like those who write gateway scripts: review widget code as you would a script.

## Symbols and published applications

The library is shared by every application:

- A **draft** (and its preview) draws the library as it is now.
- A **published version keeps its own copy** of each symbol it uses. Editing a symbol changes what operators see only when the application is published again. It shows up as a change to publish (*1 symbol changed*), and rolling a version back brings its drawings back too.
- A symbol that a draft view still uses can't be deleted.

## Sharing symbols

- **Download** some or all library symbols as a symbol package, and **import** one into another gateway, for example from a symbol marketplace. See [Projects and packages](../projects-and-packages/#symbol-packages).
- Projects carry the library too. Imported drawings are cleaned again, and views are pointed at the importing gateway's symbols by name.
