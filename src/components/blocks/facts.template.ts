import type { Template } from 'tinacms';

export const factsBlockSchema: Template = {
  name: 'facts',
  label: 'Room facts',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    {
      type: 'object',
      label: 'Facts',
      name: 'facts',
      list: true,
      ui: {
        itemProps: (item: { n?: string; t?: string }) => ({
          label: item?.n && item?.t ? `${item.n} — ${item.t}` : 'Fact',
        }),
      },
      fields: [
        { type: 'string', label: 'Number', name: 'n' },
        { type: 'string', label: 'Text', name: 't' },
      ],
    },
  ],
};
