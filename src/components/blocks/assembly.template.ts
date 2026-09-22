import type { Template } from 'tinacms';

export const assemblyBlockSchema: Template = {
  name: 'assembly',
  label: 'Fire assembly',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Caption', name: 'caption' },
    { type: 'string', label: 'Badge', name: 'badge' },
    { name: 'image', label: 'Backdrop image', type: 'image' },
    { name: 'plateSrc', label: 'Plate image', type: 'image' },
    {
      type: 'object',
      label: 'Steps',
      name: 'steps',
      list: true,
      ui: {
        itemProps: (item: { title?: string; n?: string }) => ({
          label: item?.title ? `${item?.n ?? ''} — ${item.title}` : 'Step',
        }),
      },
      fields: [
        { type: 'string', label: 'Numeral', name: 'n' },
        { type: 'string', label: 'Title', name: 'title' },
        { type: 'string', label: 'Text', name: 'text', ui: { component: 'textarea' } },
      ],
    },
  ],
  ui: {
    defaultItem: {
      eyebrow: 'The fire',
      caption: 'Scroll — the plate assembles',
      badge: 'Course VII',
    },
  },
};
