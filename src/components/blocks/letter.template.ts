import type { Template } from 'tinacms';

export const letterBlockSchema: Template = {
  name: 'letter',
  label: 'Kitchen letter',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Headline', name: 'headline' },
    { type: 'string', label: 'Margin note', name: 'marginNote' },
    { type: 'string', label: 'Paragraph 1', name: 'para1', ui: { component: 'textarea' } },
    { type: 'string', label: 'Paragraph 2', name: 'para2', ui: { component: 'textarea' } },
    { type: 'string', label: 'Signoff', name: 'signoff' },
  ],
};
