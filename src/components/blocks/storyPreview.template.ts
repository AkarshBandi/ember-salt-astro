import type { Template } from 'tinacms';

export const storyPreviewBlockSchema: Template = {
  name: 'storyPreview',
  label: 'Story preview',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Headline', name: 'headline', ui: { component: 'textarea' } },
    { type: 'string', label: 'Body 1', name: 'body1', ui: { component: 'textarea' } },
    { type: 'string', label: 'Body 2', name: 'body2', ui: { component: 'textarea' } },
    { type: 'string', label: 'Est. label', name: 'estLabel' },
    { type: 'string', label: 'CTA label', name: 'ctaLabel' },
    { type: 'string', label: 'CTA link', name: 'ctaLink' },
    { name: 'image', label: 'Portrait image', type: 'image' },
    { type: 'string', label: 'Nameplate', name: 'nameplate' },
    { type: 'string', label: 'Quote', name: 'quote', ui: { component: 'textarea' } },
  ],
  ui: {
    defaultItem: {
      eyebrow: 'The chef',
      headline: 'One room, one kiln, fourteen seats.',
      estLabel: 'est. 2019',
      ctaLabel: 'Read her letter →',
      ctaLink: '/story/',
      nameplate: 'Mara Okafor — Chef & Founder',
      quote: '“The kiln decides. I just translate.”',
    },
  },
};
