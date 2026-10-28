// Every product visual the site uses, from "Visuals to produce" in the brief.
//
// Drop the finished file into public/shots/ under the id and the page picks it
// up on the next build. Until then a labelled placeholder is shown in its place.
//   Images: <id>.png, plus <id>-dark.png for a dark-mode version
//   Video:  <id>.webm and/or <id>.mp4, optional <id>.vtt captions and <id>-poster.png
//
// All captures come from a real gateway running the Riverside demo plant,
// never a mock-up.

export interface Visual {
  title: string;
  shows: string;
  format: string;
  alt: string;
  kind: 'image' | 'video';
  /** Placeholder shape until the real file exists. */
  aspect: string;
}

export const visuals = {
  'hero-composite': {
    title: 'Hero composite',
    shows: 'The Riverside overview on a laptop and a tablet, same live values',
    format: 'PNG, 2x, light and dark',
    alt: 'The Riverside water treatment overview open on a laptop and a tablet, showing the same live values',
    kind: 'image',
    aspect: '16 / 9',
  },
  'assistant-recording': {
    title: 'Assistant recording',
    shows: 'A pump overview built from a prompt, step by step, ending on the draft',
    format: 'MP4/WebM, 20–30 s, no audio, captions',
    alt: 'The AI assistant building a pump overview from a prompt, step by step, ending on the draft view in the editor',
    kind: 'video',
    aspect: '16 / 10',
  },
  'template-overrides': {
    title: 'Template override panel',
    shows: "The instance dialog with one member's overrides open and two marked",
    format: 'PNG',
    alt: 'Instance dialog with the override panel open beside a member, two overrides marked',
    kind: 'image',
    aspect: '16 / 10',
  },
  'create-several': {
    title: 'Create several',
    shows: '40 numbered instances, every row checked green',
    format: 'PNG',
    alt: 'Create several dialog listing pumps P-101 to P-140, every row checked',
    kind: 'image',
    aspect: '4 / 3',
  },
  'operator-app-screens': {
    title: 'Operator app on three screens',
    shows: 'The same application on a wall screen, a tablet and a phone',
    format: 'PNG composite',
    alt: 'The same operator application open on a wall screen, a tablet and a phone',
    kind: 'image',
    aspect: '16 / 8',
  },
  'symbol-editor': {
    title: 'Symbol editor',
    shows: 'A tank symbol with its fill level animated from a tag',
    format: 'Short loop, 5 s',
    alt: 'Symbol editor with a tank symbol whose fill level is animated from a tag',
    kind: 'video',
    aspect: '4 / 3',
  },
  'alarm-timeline': {
    title: 'Alarm timeline',
    shows: 'Activated, notified, acknowledged with a note, returned to normal',
    format: 'PNG',
    alt: 'Alarm timeline: activated, notified, acknowledged with the note "Breaker reset, monitoring", returned to normal',
    kind: 'image',
    aspect: '16 / 10',
  },
  'on-call-policy': {
    title: 'On-call policy',
    shows: 'A two-step escalation policy',
    format: 'PNG',
    alt: 'Escalation policy with two steps: Operators at once, Engineering after 15 minutes',
    kind: 'image',
    aspect: '4 / 3',
  },
  trend: {
    title: 'Trend',
    shows: 'Three pens over one shift',
    format: 'PNG',
    alt: 'Trend chart with three pens over one shift',
    kind: 'image',
    aspect: '16 / 9',
  },
  'shift-report': {
    title: 'Shift report',
    shows: 'Page 1 of a scheduled shift report PDF',
    format: 'PNG of the PDF',
    alt: 'First page of a scheduled shift report PDF',
    kind: 'image',
    aspect: '3 / 4',
  },
  'script-editor': {
    title: 'Script editor',
    shows: 'A tag script with completion showing the nexus. API',
    format: 'PNG',
    alt: 'Script editor with a tag script and code completion listing the nexus. API',
    kind: 'image',
    aspect: '16 / 10',
  },
  'device-list': {
    title: 'Device list and address editor',
    shows: 'Live device states; "40001 = holding register 1"',
    format: 'PNG',
    alt: 'Device list with live connection states, and the Modbus address editor showing 40001 as holding register 1',
    kind: 'image',
    aspect: '16 / 10',
  },
  'system-health': {
    title: 'System health',
    shows: 'Both gateways of a redundant pair, roles and heartbeats',
    format: 'PNG',
    alt: 'System health page showing both gateways of a redundant pair with their roles and heartbeats',
    kind: 'image',
    aspect: '16 / 9',
  },
} satisfies Record<string, Visual>;

export type VisualId = keyof typeof visuals;
