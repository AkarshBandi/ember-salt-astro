import type { Template } from 'tinacms';

export const visitIntroBlockSchema: Template = {
  name: 'visitIntro',
  label: 'Visit intro',
  fields: [
    { type: 'string', label: 'Eyebrow', name: 'eyebrow' },
    { type: 'string', label: 'Headline', name: 'headline' },
    { type: 'string', label: 'Description', name: 'description', ui: { component: 'textarea' } },
    { type: 'string', label: 'Note 1', name: 'note1' },
    { type: 'string', label: 'Note 2', name: 'note2' },
    { type: 'string', label: 'Note 3', name: 'note3' },
  ],
  ui: {
    defaultItem: {
      eyebrow: 'Reservations',
      headline: 'Request a table.',
      description:
        'Tell us when and how many. We telephone within a day to confirm — every request is answered by voice.',
      note1: 'Parties above six — telephone only: +1 503 555 0184.',
      note2: 'Mon – Wed the kiln rests. We telephone — never text, never spam.',
      note3: '14 Kiln Lane, Portland OR — look for the brass flame by the door.',
    },
  },
};
