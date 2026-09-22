import type { Template } from 'tinacms';

export const suppliersBlockSchema: Template = {
  name: 'suppliers',
  label: 'Suppliers strip',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Headline', name: 'headline' },
    { type: 'string', label: 'Hint', name: 'hint' },
    {
      type: 'object',
      label: 'Suppliers',
      name: 'suppliers',
      list: true,
      ui: {
        itemProps: (item: { name?: string }) => ({ label: item?.name ?? 'Supplier' }),
      },
      fields: [
        { type: 'string', label: 'Name', name: 'name' },
        { type: 'string', label: 'Description', name: 'desc' },
        { name: 'img', label: 'Image', type: 'image' },
      ],
    },
  ],
};
