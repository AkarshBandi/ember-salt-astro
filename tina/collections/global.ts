import type { Collection } from 'tinacms';

export const GlobalCollection: Collection = {
  name: 'config',
  label: 'Global config',
  path: 'src/content/config',
  format: 'json',
  ui: { global: true },
  fields: [
    {
      name: 'seo',
      label: 'Site identity & SEO',
      type: 'object',
      fields: [
        { name: 'title', label: 'Site name', type: 'string', required: true },
        { name: 'description', label: 'Default meta description', type: 'string', required: true },
      ],
    },
    {
      name: 'nav',
      label: 'Navigation menu',
      type: 'object',
      list: true,
      ui: {
        itemProps: (item: { title?: string }) => ({ label: item?.title ?? 'Link' }),
      },
      fields: [
        { name: 'title', label: 'Title', type: 'string', required: true },
        { name: 'link', label: 'Link', type: 'string', required: true },
      ],
    },
    {
      name: 'footer',
      label: 'Footer',
      type: 'object',
      fields: [
        { name: 'ctaEyebrow', label: 'CTA eyebrow', type: 'string' },
        { name: 'ctaHeadline', label: 'CTA headline', type: 'string' },
        { name: 'ctaText', label: 'CTA text', type: 'string', ui: { component: 'textarea' } },
        { name: 'phone', label: 'Phone', type: 'string' },
        { name: 'email', label: 'Email', type: 'string' },
        { name: 'address1', label: 'Address line 1', type: 'string' },
        { name: 'address2', label: 'Address line 2', type: 'string' },
      ],
    },
  ],
};
