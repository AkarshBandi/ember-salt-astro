import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: 'main',
  clientId: process.env.PUBLIC_TINA_CLIENT_ID!,
  token: process.env.TINA_TOKEN!,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'images',
    },
  },
  schema: {
    collections: [
      {
        name: 'general',
        label: 'Site Settings',
        path: 'src/content/site',
        format: 'yaml',
        match: {
          include: 'general',
        },
        fields: [
          { name: 'seo_title', label: 'SEO Title', type: 'string' },
          { name: 'description', label: 'Description', type: 'string', ui: { component: 'textarea' } },
          {
            name: 'nav_links',
            label: 'Navigation Links',
            type: 'object',
            list: true,
            fields: [
              { name: 'label', label: 'Label', type: 'string' },
              { name: 'href', label: 'Href', type: 'string' },
            ],
          },
        ],
      },
      {
        name: 'acts',
        label: 'Tasting Menu (Courses)',
        path: 'src/content/site',
        format: 'yaml',
        match: {
          include: 'acts',
        },
        fields: [
          {
            name: 'courses',
            label: 'Courses',
            type: 'object',
            list: true,
            fields: [
              { name: 'n', label: 'Roman Numeral', type: 'string' },
              { name: 'numeral', label: 'Number', type: 'string' },
              { name: 'time', label: 'Time', type: 'string' },
              { name: 'name', label: 'Name', type: 'string' },
              { name: 'sense', label: 'Sense', type: 'string' },
              { name: 'line', label: 'Description', type: 'string', ui: { component: 'textarea' } },
              { name: 'img', label: 'Image', type: 'image' },
              { name: 'imgB', label: 'Image B (Choice)', type: 'image', required: false },
              { name: 'accent', label: 'Accent Color', type: 'string' },
              {
                name: 'choice',
                label: 'Choices',
                type: 'string',
                list: true,
                required: false,
              },
            ],
          },
        ],
      },
      {
        name: 'journal',
        label: 'Journal Entries',
        path: 'src/content/journal',
        format: 'markdown',
        fields: [
          { name: 'title', label: 'Title', type: 'string', isTitle: true, required: true },
          { name: 'date', label: 'Date', type: 'datetime' },
          { name: 'category', label: 'Category', type: 'string' },
          { name: 'description', label: 'Description', type: 'string', ui: { component: 'textarea' } },
          { name: 'image', label: 'Image', type: 'image' },
          { name: 'body', label: 'Body', type: 'rich-text', isBody: true },
        ],
      },
    ],
  },
});
