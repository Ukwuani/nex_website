---
title: Barcode and QR scanning
description: Let operators scan barcodes and QR codes into a screen with a Zebra scan trigger, a USB or Bluetooth scanner, or the device's camera, and print QR labels that open equipment screens.
---

Operators can scan barcodes and QR codes into a view: a batch label, a work order, a part number, or a QR label on a pump that opens its screen. Scans work with:

- **Zebra mobile computers** and other Android devices with a scan engine (the scan trigger).
- **USB and Bluetooth scanners** that type what they read.
- **The device's camera**, on phones and tablets without a scan engine.

Scans work in the view that fills the screen in an application (not in docked panels or popups), and when engineers try a view with **Open**.

## What a scan does

Set this per view: open the view editor, select nothing, and find **Barcode scans** in the property panel.

- **On scan:** open a view, open a popup, or run a gateway script. `${scan}` is the code that was read. Use it in the view's parameters, the script's payload or the confirmation question: `batch = ${scan}` opens the batch screen for the scanned batch. A script gets the code as `payload.code` by default.
- **Camera button:** shows a scan button over the view, for phones and tablets.

Scans never write tags directly. To act on a code, send it to a gateway script: it can check the code, write tags, and reply with a message or a view to open:

```js
// Message handler "scan-batch": look the batch up in the MES, then open its screen
const res = await nexus.net.http({ url: 'https://mes.plant.local/api/batches/' + encodeURIComponent(payload.code) });
if (!res.ok) return { message: 'Batch ' + payload.code + ' not found', severity: 'warning' };
await nexus.tag.write('line1.batch.current', res.json.id);
return { navigate: { viewId: 12, params: { batch: String(res.json.id) } } };
```

A scanned **QR code that links to a view** (`https://<gateway>/apps/<app>/<view>?…`) always opens that view, whatever the current view's setting. A link to another application opens that application.

## QR labels for equipment

1. Open the view (for example a pump faceplate) and choose **QR code**.
2. Fill in its parameters, for example `pump = plant.p101`.
3. Set **Gateway address** to the address phones and scanners use (`https://scada-a.plant.local:4443`), not `localhost`.
4. Download the label as PNG or SVG and print it.

Scanning the label with a Zebra device, a view's camera button or any phone camera opens that pump's screen. Labels work on both gateways of a redundant pair.

## Setting up a Zebra device

Zebra devices type scans into the browser through **DataWedge**. Do this once per device, or push it from your device management (MDM):

1. Open **DataWedge** and create a profile, for example *Nexus*.
2. **Associated apps:** add the browser operators use (Chrome is `com.android.chrome`), with all activities (`*`).
3. **Barcode input:** enabled, with the symbologies you use (QR Code, Code 128, EAN/UPC, Data Matrix…).
4. **Keystroke output:** enabled. Under *Basic data formatting*, turn on *Send data* and **Send ENTER key**. Leave the inter-character delay at 0.
5. **Intent output:** off.

Then open the application in that browser and press the trigger.

## USB and Bluetooth scanners

They work the same way out of the box. If a scanner doesn't already send Enter (or Tab) after each code, set it to.

## How scans are told apart from typing

A scanner sends the whole code in a burst, a few milliseconds per character, usually followed by Enter. Nexus takes a burst of 3 or more characters ending in Enter or Tab, or 6 or more with no ending, as a scan; a person typing is ignored. A scan while a text field has focus goes into the field, as typing would, so the **Text field** symbol takes scans too.

## The camera

The camera needs the gateway on **HTTPS with a certificate the devices trust** (see [Connectivity → HTTPS](../connectivity/#https)); browsers only allow the camera on secure pages. Chrome on Android (Zebra devices included) and on macOS reads codes itself. Elsewhere, such as iPhone and Windows, Nexus uses its own reader, served by the gateway. Nothing is loaded from the internet, so it works on a plant network without internet access.
