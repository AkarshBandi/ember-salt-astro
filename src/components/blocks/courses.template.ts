import type { Template } from 'tinacms';

export const coursesBlockSchema: Template = {
  name: 'courses',
  label: 'Tasting courses',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Headline', name: 'headline' },
    { type: 'string', label: 'Description', name: 'description', ui: { component: 'textarea' } },
    {
      type: 'string',
      label: 'Layout',
      name: 'layout',
      options: [
        { label: 'Home flight cards', value: 'flight' },
        { label: 'Menu dusk list', value: 'dusk' },
      ],
    },
    {
      type: 'object',
      label: 'Courses',
      name: 'courses',
      list: true,
      ui: {
        itemProps: (item: { name?: string; n?: string }) => ({
          label: item?.name ? `${item?.n ?? ''} — ${item.name}` : 'Course',
        }),
      },
      fields: [
        { name: 'n', label: 'Roman numeral', type: 'string' },
        { name: 'numeral', label: 'Number', type: 'string' },
        { name: 'time', label: 'Time', type: 'string' },
        { name: 'name', label: 'Name', type: 'string' },
        { name: 'sense', label: 'Sense line', type: 'string' },
        { name: 'line', label: 'Description', type: 'string', ui: { component: 'textarea' } },
        { name: 'img', label: 'Image', type: 'image' },
        { name: 'imgB', label: 'Image B (choice)', type: 'image', required: false },
        { name: 'accent', label: 'Accent color', type: 'string' },
        { name: 'choice', label: 'Choices', type: 'string', list: true, required: false },
      ],
    },
  ],
  ui: {
    defaultItem: {
      eyebrow: 'The menu — dinner in five courses',
      headline: 'Five plates land. Scroll to serve.',
      description:
        'A tasting menu means the kitchen decides the order — small plates, eaten in sequence.',
      layout: 'flight',
    },
  },
};
