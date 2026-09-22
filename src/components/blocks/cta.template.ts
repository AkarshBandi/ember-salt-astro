import type { Template } from 'tinacms';

export const ctaBlockSchema: Template = {
  name: 'cta',
  label: 'Closing CTA',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Headline', name: 'headline', ui: { component: 'textarea' } },
    { type: 'string', label: 'Primary label', name: 'primaryLabel' },
    { type: 'string', label: 'Primary link', name: 'primaryLink' },
    { type: 'string', label: 'Secondary label', name: 'secondaryLabel' },
    { type: 'string', label: 'Secondary link', name: 'secondaryLink' },
  ],
  ui: {
    defaultItem: {
      eyebrow: 'If that sounds like dinner to you',
      headline: 'Two seatings nightly. Fourteen seats.',
      primaryLabel: 'Request a table →',
      primaryLink: '/visit/',
      secondaryLabel: 'Read the menu first',
      secondaryLink: '/menu/',
    },
  },
};
