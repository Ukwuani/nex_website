// The eight feature pages, in Product menu order. Icons are lucide-static names.

export interface ProductPage {
  href: string;
  name: string;
  blurb: string;
  icon: string;
}

export const productPages: ProductPage[] = [
  { href: '/connectivity/', name: 'Connectivity', blurb: 'Modbus, S7, EtherNet/IP, OPC UA, MQTT', icon: 'plug' },
  { href: '/templates/', name: 'Templates', blurb: 'Model a pump once, get forty', icon: 'boxes' },
  { href: '/applications/', name: 'Operator applications', blurb: 'Full-screen apps on any device', icon: 'monitor-smartphone' },
  { href: '/alarms/', name: 'Alarms and on-call', blurb: 'Rules, rosters and escalation', icon: 'bell-ring' },
  { href: '/history/', name: 'History and reports', blurb: 'Historian, trends, shift reports', icon: 'chart-line' },
  { href: '/scripting/', name: 'Scripting', blurb: 'JavaScript and Node-RED', icon: 'code-xml' },
  { href: '/ai-assistant/', name: 'AI assistant', blurb: 'Drafts screens from real tags', icon: 'sparkles' },
  { href: '/integrations/', name: 'Integrations', blurb: 'OPC UA, MQTT, REST and multi-site', icon: 'share-2' },
];

// Landing pages for two of the brief's audiences. Linked from the foot of the
// Product menu and from the footer.
export const audiencePages: ProductPage[] = [
  { href: '/integrators/', name: 'System integrators', blurb: 'Reuse your work across clients and sites', icon: 'briefcase' },
  { href: '/operations/', name: 'Operations teams', blurb: 'Screens for operators, alarms that reach someone', icon: 'users' },
];
