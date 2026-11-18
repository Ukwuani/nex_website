// Site-wide settings. Anything marked OPEN is waiting on an answer from the
// product owner; see "Open questions" in README.md.

export const site = {
  // Airogine makes Nexus, its only product: the site is Airogine's, and every
  // product page is about Nexus.
  company: 'Airogine',
  product: 'Nexus',

  // Brand positioning: the company's line and the product's. Used in the footer,
  // the Nexus menu, the home page and the structured data; keep them word for word.
  companyTagline: 'Engineering the future of industrial operations.',
  productTagline: 'The operating platform for modern manufacturing.',

  // The privacy policy and terms of use. OPEN: the contact address for privacy
  // questions and requests (until it is set, both pages say it is coming), and
  // the US state Airogine is organized in (named as the governing law once set).
  legal: {
    contactEmail: '',
    state: '',
    privacyUpdated: '2026-11-17',
    termsUpdated: '2026-11-17',
  },

  // Social profiles, listed in the structured data as the company's (sameAs).
  // e.g. 'https://www.linkedin.com/company/airogine'. Only add real ones.
  profiles: [] as string[],

  // The user documentation (src/content/docs/), and the page the deployment
  // guide links point at.
  docsUrl: '/docs/',
  deploymentGuideUrl: '/docs/installation/',

  // OPEN: the endpoint that receives demo requests (a CRM or form service).
  // While it is empty, the form tells the visitor it is not connected yet
  // instead of pretending to send.
  demoFormAction: '',

  // To produce: a PDF made from the Security page. The download button on the
  // Security page only appears once this is set, e.g. '/nexus-security-overview.pdf'.
  securityOverviewPdf: '',
};
