export const journalPost = {
  name: 'journalPost',
  title: 'Journal entry',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Web address', type: 'slug' },
    { name: 'date', title: 'Date', type: 'datetime' },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'description', title: 'Description', type: 'text', rows: 4 },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    },
    { name: 'body', title: 'Body', type: 'text', rows: 8 },
  ],
};
