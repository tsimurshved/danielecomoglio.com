const baseUrl = (process.env.BACKSTOP_BASE_URL || 'https://danielecomoglio-staging.ragaihub.com').replace(/\/$/, '');

const pages = [
  { label: 'home', path: '/' },
  { label: 'about', path: '/about/' },
  { label: 'tour', path: '/tour/' },
  { label: 'media', path: '/media/' },
  { label: 'saxophonerecording', path: '/saxophonerecording/' }
];

module.exports = {
  id: 'danielecomoglio-visual',
  viewports: [
    { label: 'desktop', width: 1440, height: 900 },
    { label: 'mobile', width: 390, height: 844 }
  ],
  scenarios: pages.map((page) => ({
    label: page.label,
    url: `${baseUrl}${page.path}`,
    delay: 2500,
    misMatchThreshold: 1,
    requireSameDimensions: true
  })),
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
    engine_scripts: 'backstop_data/engine_scripts',
    html_report: 'backstop_data/html_report',
    ci_report: 'backstop_data/ci_report'
  },
  report: ['browser', 'CLI'],
  engine: 'playwright',
  engineOptions: {
    browser: 'chromium',
    args: ['--no-sandbox']
  },
  asyncCaptureLimit: 3,
  asyncCompareLimit: 10,
  debug: false,
  debugWindow: false
};
