// Vercel Function behind the Book a demo form (src/pages/demo.astro): checks
// the request and emails it to the team through Resend's API.
//
// Set in the Vercel project's environment variables:
//   RESEND_API_KEY   an API key from resend.com
//   DEMO_FROM_EMAIL  the sender, on a domain verified in Resend,
//                    e.g. 'Airogine website <demo@airogine.com>'
//   DEMO_TO_EMAIL    where requests go; several addresses separated by commas
//
// Not served by `npm run dev`; use `vercel dev` to try it locally.

const PROTOCOLS = ['Modbus TCP', 'Modbus RTU', 'Siemens S7', 'EtherNet/IP', 'OPC UA', 'MQTT Sparkplug B'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const reply = (status: number, message: string) =>
    wantsJson
      ? Response.json({ ok: status < 400, message }, { status })
      : new Response(message, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return reply(400, 'The form could not be read. Please go back and try again.');
  }

  const field = (name: string, max: number) =>
    String(data.get(name) ?? '')
      .trim()
      .slice(0, max);
  const line = (name: string, max: number) => field(name, max).replace(/\s+/g, ' ');

  // Bots fill in the hidden "website" field; people never see it. Answer as if
  // it worked so they don't retry.
  if (field('website', 200)) return done(wantsJson, request);

  const name = line('name', 120);
  const email = line('email', 200);
  const company = line('company', 160);
  const role = line('role', 80);
  const protocols = data
    .getAll('protocols')
    .map(String)
    .filter((p) => PROTOCOLS.includes(p));
  const devices = field('devices', 5000);

  if (!name || !company || !EMAIL.test(email)) {
    return reply(400, 'Please fill in your name, a valid work email and your company.');
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.DEMO_FROM_EMAIL;
  const to = (process.env.DEMO_TO_EMAIL ?? '')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean);
  if (!key || !from || !to.length) {
    console.error('Demo request not sent: RESEND_API_KEY, DEMO_FROM_EMAIL or DEMO_TO_EMAIL is not set.');
    return reply(500, 'Demo requests could not be sent just now. Please try again later.');
  }

  const text = [
    `Name:      ${name}`,
    `Email:     ${email}`,
    `Company:   ${company}`,
    `Role:      ${role || 'Not given'}`,
    `Protocols: ${protocols.join(', ') || 'Not given'}`,
    '',
    'Device list:',
    devices || 'Not given',
    '',
    '--',
    'Sent from the Book a demo form on www.airogine.com. Reply to answer them directly.',
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `Demo request: ${name}, ${company}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error(`Demo request not sent: Resend answered ${res.status}`, await res.text());
    return reply(502, 'Demo requests could not be sent just now. Please try again later.');
  }

  return done(wantsJson, request);
}

// The page's script asks for JSON; without JavaScript, the browser goes to the
// thank-you page instead.
function done(wantsJson: boolean, request: Request) {
  if (wantsJson) return Response.json({ ok: true });
  return Response.redirect(new URL('/demo/thanks/', request.url), 303);
}
