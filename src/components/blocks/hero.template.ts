import type { Template } from 'tinacms';

export const heroBlockSchema: Template = {
  name: 'hero',
  label: 'Hero',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Miles label', name: 'miles' },
    { type: 'string', label: 'Tagline', name: 'tagline', ui: { component: 'textarea' } },
    { type: 'string', label: 'Primary button label', name: 'primaryLabel' },
    { type: 'string', label: 'Primary button link', name: 'primaryLink' },
    { type: 'string', label: 'Secondary button label', name: 'secondaryLabel' },
    { type: 'string', label: 'Secondary button link', name: 'secondaryLink' },
    { type: 'string', label: 'Scroll note', name: 'scrollNote' },
    {
      type: 'object',
      label: 'Plate image',
      name: 'plateImage',
      fields: [
        { name: 'src', label: 'Image source', type: 'image' },
        { name: 'alt', label: 'Alt text', type: 'string' },
      ],
    },
    {
      type: 'object',
      label: 'Hero background',
      name: 'bgImage',
      fields: [
        { name: 'src', label: 'Image source', type: 'image' },
        { name: 'alt', label: 'Alt text', type: 'string' },
      ],
    },
  ],
  ui: {
    defaultItem: {
      eyebrow: 'Woodfire & fermentation — Portland',
      miles: '40 miles',
      tagline: 'Twelve courses. Fourteen seats. One oak kiln.',
      primaryLabel: 'Read the menu',
      primaryLink: '/menu/',
      secondaryLabel: 'Secure a table',
      secondaryLink: '/visit/',
      scrollNote: 'Scroll slowly',
    },
  },
};
