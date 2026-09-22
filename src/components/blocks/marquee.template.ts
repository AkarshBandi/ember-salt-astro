import type { Template } from 'tinacms';

export const marqueeBlockSchema: Template = {
  name: 'marquee',
  label: 'Press marquee',
  fields: [
    {
      type: 'object',
      label: 'Items',
      name: 'phrases',
      list: true,
      ui: {
        itemProps: (item: { text?: string }) => ({ label: item?.text ?? 'Item' }),
        defaultItem: { text: 'Twelve courses' },
      },
      fields: [{ type: 'string', label: 'Text', name: 'text' }],
    },
  ],
  ui: {
    defaultItem: {
      items: [
        { text: 'Twelve courses' },
        { text: 'Within forty miles' },
        { text: 'Oak woodfire' },
        { text: 'Natural pairings' },
        { text: 'House fermentation' },
      ],
    },
  },
};
