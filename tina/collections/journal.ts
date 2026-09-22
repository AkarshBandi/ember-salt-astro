import type { Collection } from 'tinacms';

export const JournalCollection: Collection = {
  name: 'journal',
  label: 'Journal Entries',
  path: 'src/content/journal',
  format: 'markdown',
  ui: {
    router: ({ document }) => `/journal/${document._sys.filename}`,
  },
  fields: [
    { name: 'title', label: 'Title', type: 'string', isTitle: true, required: true },
    { name: 'date', label: 'Date', type: 'datetime' },
    { name: 'category', label: 'Category', type: 'string' },
    { name: 'description', label: 'Description', type: 'string', ui: { component: 'textarea' } },
    { name: 'image', label: 'Image', type: 'image' },
    { name: 'body', label: 'Body', type: 'rich-text', isBody: true },
  ],
};
