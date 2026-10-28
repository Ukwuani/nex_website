// Site-wide settings. Anything marked OPEN is waiting on an answer from the
// product owner; see "Open questions" in README.md.

export const site = {
  name: 'Nexus',

  // OPEN: the company behind Nexus, shown in the footer copyright line.
  company: 'Nexus',

  // OPEN: where the public documentation will live. Until it is published,
  // /docs/ explains that the docs are on their way.
  docsUrl: '/docs/',
  deploymentGuideUrl: '/docs/',

  // OPEN: the endpoint that receives demo requests (a CRM or form service).
  // While it is empty, the form tells the visitor it is not connected yet
  // instead of pretending to send.
  demoFormAction: '',

  // To produce: a PDF made from the Security page. The download button on the
  // Security page only appears once this is set, e.g. '/nexus-security-overview.pdf'.
  securityOverviewPdf: '',
};
