---
title: Applications
description: Publish views to operators as full-screen applications - navigation menus, docked panels, alarm ribbons and the horn, drafts, publishing and versions, access, kiosk screens, and how operators use them.
---

An **application** is what operators use: a line HMI, a maintenance app, an energy dashboard. It has its own views, navigation, title and colour, and runs full screen at `https://<gateway>/apps/<name>` in any browser. There are no engineering menus, and control-room screens, tablets and phones need nothing installed.

Tags, devices, alarms and history are shared by every application. A new gateway starts with one application, **Operations**, at `/apps/operations`.

## Using an application

Open `/apps` to see the applications you may open (with only one, it opens straight away), or a direct link from your engineer.

- **The header** shows the application's title, its navigation menu, the clock and your name. Your account menu has **Sign out**.
- **The navigation menu** opens views. It is either a menu bar in the header (submenus drop down) or a side panel (submenus fold out). Some applications navigate with buttons inside the views instead.
- **The alarm ribbon** under the header shows the newest unacknowledged alarm that belongs to the screen you are on. Acknowledge it there, or open the list.
- **The bell** lists every active alarm you may see, whatever screen you are on. Open one to see its details and acknowledge it with a note.
- **The horn**, if the application sounds one, plays for new alarms until they are acknowledged or you silence it.
- **Controls** write values when you have the *Operate* permission. Buttons may ask you to confirm first. Without permission, controls are read-only.
- **Popups** open over the screen. Drag them by the title bar, and press <kbd>Esc</kbd> to close the top one.
- **Every screen has its own address**, so you can bookmark it and the browser's Back button works.
- On a phone or tablet, screens fit themselves and re-fit when you rotate; pinch or use the zoom buttons to zoom in.

When engineers publish a new version, open screens switch to it within a minute.

## Building an application

Applications are built under **Views**:

1. Pick the application in the bar above the views, or choose **New application…**.
2. Add views to it (see [Views](../views/)).
3. Open **Settings** to set it up (below).
4. **Preview** opens the draft in the operators' client (`/preview/<name>`, engineers only).
5. **Publish** makes it live.

### Settings

| Setting | Does |
|---|---|
| **Title** and **colour** | Shown in the header |
| **Home view** | Opens first. Empty opens the first navigation item |
| **Navigation** | Menu items, each opening a view with values for its parameters, so one pump faceplate can appear as *P-101* and *P-102*. Items can have submenus |
| **Where the menu shows** | A menu bar in the header, a side panel, or no menu (views navigate with buttons and **Menu** symbols of their own) |
| **Docked views** | Views docked to the top, bottom, left or right on every page: a header or footer strip, a navigation tree, an alarm summary. Each has a size, parameter values, a width below which it hides, and for side docks whether operators can fold it away |
| **Alarm ribbon** | *Show the newest unacknowledged alarm under the header*, on or off for the whole application |
| **Horn** | *Sound the horn for new alarms*, from a chosen priority up |
| **Who may open it** | Limits the application to roles. Empty means everyone who can see views; administrators always may. Applies at once, without publishing |

Navigation and the home view use the application's own views. A view can still embed or pop up views from other applications.

### Alarm ribbons

The ribbon over an application's screens shows the alarms that belong to the view on screen. Each view's **Alarm ribbon** setting (in the view editor, with nothing selected) picks:

- **Alarms of this view's asset:** alarms of tags under the view's asset and the equipment below it. This is the default when the view has an asset.
- **All operator alarms:** the default for a view without an asset.
- **No ribbon.**

Alarm rules with *Show to operators* turned off, such as the gateway's own health alarms, never appear on operator screens. Operators can always reach every alarm they may see from the bell.

## Drafts, publishing and versions

What engineers change is a **draft**. Operators keep the live version until someone publishes.

- **Publish** lists what changed (new, changed and removed views, settings, and library symbols) and takes a note for the history.
- **Versions** lists every version with its note, who published it and what changed. **Make live** puts an earlier version back; the draft isn't touched.
- People without the *Engineer* permission only ever see live versions, in applications and on the Views page.

## Who sees what

- **Who may open it** limits an application to roles.
- Navigation only lists views inside a person's [asset scope](../assets/#limiting-users-to-parts-of-the-plant).
- Viewers can look. Operators can also write, acknowledge alarms and run scripts from buttons.

## Kiosk screens

For a wall screen or a control-room display:

1. Create an operator (or viewer) account for the screen under **Users**.
2. Sign in once on the screen's browser.
3. Start the browser full screen, for example:

   ```bash
   chromium --kiosk --noerrdialogs https://gateway:4443/apps/operations
   ```

   or use the application's full-screen button.

A screen in use stays signed in: its sign-in slides forward as it refreshes. Signing out, disabling the account under Users, or resetting its password ends it.

## Moving applications between gateways

- **Download** an application (its views and the symbols they draw) as an application package, and **Import application…** on another gateway. Imports land in the draft, ready to review and publish. See [Projects and packages](../projects-and-packages/#application-packages).
- Projects carry every application's draft. Versions stay on the gateway they were published on.
