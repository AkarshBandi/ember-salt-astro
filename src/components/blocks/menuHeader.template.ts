import type { Template } from 'tinacms';

export const menuHeaderBlockSchema: Template = {
  name: 'menuHeader',
  label: 'Menu header',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Headline line 1', name: 'headline1' },
    { type: 'string', label: 'Headline line 2', name: 'headline2' },
    { type: 'string', label: 'Description', name: 'description', ui: { component: 'textarea' } },
    { name: 'background', label: 'Background image', type: 'image' },
  ],
  ui: {
    defaultItem: {
      eyebrow: 'The menu — one evening, twelve courses',
      headline1: 'Eat in order.',
      headline2: 'Choose twice.',
      description:
        'Twelve courses, £185. Wine pairing £95, juice pairing £55. The whole table takes the tasting. Scroll — the light dies as dinner progresses.',
    },
  },
};
