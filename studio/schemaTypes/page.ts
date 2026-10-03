import { blockTypes } from './blocks';

export const page = {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    { name: 'seoTitle', title: 'Page name', type: 'string' },
    { name: 'slug', title: 'Web address', type: 'slug' },
    {
      name: 'blocks',
      title: 'Sections',
      type: 'array',
      of: blockTypes.map((b) => ({ type: b.name })),
    },
  ],
};
