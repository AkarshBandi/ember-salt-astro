// Block object types for the Sanity page schema.
// Fields mirror what the site renders; images are Sanity image fields
// keeping the same field names (bgImage, plateImage, img, etc.) with an `alt` sub-field.

const altField = { name: 'alt', title: 'Alt text', type: 'string' };

export const heroBlock = {
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
    { name: 'miles', title: 'Miles label', type: 'string' },
    { name: 'tagline', title: 'Tagline', type: 'text', rows: 3 },
    { name: 'primaryLabel', title: 'Primary button label', type: 'string' },
    { name: 'primaryLink', title: 'Primary button link', type: 'string' },
    { name: 'secondaryLabel', title: 'Secondary button label', type: 'string' },
    { name: 'secondaryLink', title: 'Secondary button link', type: 'string' },
    { name: 'scrollNote', title: 'Scroll note', type: 'string' },
    { name: 'plateImage', title: 'Plate image', type: 'image', options: { hotspot: true }, fields: [altField] },
    { name: 'bgImage', title: 'Hero background', type: 'image', options: { hotspot: true }, fields: [altField] },
  ],
};

export const marqueeBlock = {
  name: 'marqueeBlock',
  title: 'Press marquee',
  type: 'object',
  fields: [
    {
      name: 'phrases',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'marqueePhrase',
          title: 'Item',
          fields: [{ name: 'text', title: 'Text', type: 'string' }],
        },
      ],
    },
  ],
};

export const coursesBlock = {
  name: 'coursesBlock',
  title: 'Tasting courses',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
    { name: 'headline', title: 'Headline', type: 'string' },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Home flight cards', value: 'flight' },
          { title: 'Menu dusk list', value: 'dusk' },
        ],
      },
    },
    {
      name: 'courses',
      title: 'Courses',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'course',
          title: 'Course',
          fields: [
            { name: 'n', title: 'Roman numeral', type: 'string' },
            { name: 'numeral', title: 'Number', type: 'string' },
            { name: 'time', title: 'Time', type: 'string' },
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'sense', title: 'Sense line', type: 'string' },
            { name: 'line', title: 'Description', type: 'text', rows: 3 },
            { name: 'img', title: 'Image', type: 'image', options: { hotspot: true }, fields: [altField] },
            { name: 'imgB', title: 'Image B (choice)', type: 'image', options: { hotspot: true }, fields: [altField] },
            { name: 'accent', title: 'Accent color', type: 'string' },
            { name: 'choice', title: 'Choices', type: 'array', of: [{ type: 'string' }] },
          ],
        },
      ],
    },
  ],
};

export const assemblyBlock = {
  name: 'assemblyBlock',
  title: 'Fire assembly',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
    { name: 'caption', title: 'Caption', type: 'string' },
    { name: 'badge', title: 'Badge', type: 'string' },
    { name: 'image', title: 'Backdrop image', type: 'image', options: { hotspot: true }, fields: [altField] },
    { name: 'plateSrc', title: 'Plate image', type: 'image', options: { hotspot: true }, fields: [altField] },
    {
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'assemblyStep',
          title: 'Step',
          fields: [
            { name: 'n', title: 'Numeral', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'text', title: 'Text', type: 'text', rows: 3 },
          ],
        },
      ],
    },
  ],
};

export const storyPreviewBlock = {
  name: 'storyPreviewBlock',
  title: 'Story preview',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
    { name: 'headline', title: 'Headline', type: 'text', rows: 2 },
    { name: 'body1', title: 'Body 1', type: 'text', rows: 4 },
    { name: 'body2', title: 'Body 2', type: 'text', rows: 4 },
    { name: 'estLabel', title: 'Est. label', type: 'string' },
    { name: 'ctaLabel', title: 'CTA label', type: 'string' },
    { name: 'ctaLink', title: 'CTA link', type: 'string' },
    { name: 'image', title: 'Portrait image', type: 'image', options: { hotspot: true }, fields: [altField] },
    { name: 'nameplate', title: 'Nameplate', type: 'string' },
    { name: 'quote', title: 'Quote', type: 'text', rows: 2 },
  ],
};

export const menuHeaderBlock = {
  name: 'menuHeaderBlock',
  title: 'Menu header',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
    { name: 'headline1', title: 'Headline line 1', type: 'string' },
    { name: 'headline2', title: 'Headline line 2', type: 'string' },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
    { name: 'background', title: 'Background image', type: 'image', options: { hotspot: true }, fields: [altField] },
  ],
};

export const letterBlock = {
  name: 'letterBlock',
  title: 'Kitchen letter',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
    { name: 'headline', title: 'Headline', type: 'string' },
    { name: 'marginNote', title: 'Margin note', type: 'string' },
    { name: 'para1', title: 'Paragraph 1', type: 'text', rows: 4 },
    { name: 'para2', title: 'Paragraph 2', type: 'text', rows: 4 },
    { name: 'signoff', title: 'Signoff', type: 'string' },
  ],
};

export const factsBlock = {
  name: 'factsBlock',
  title: 'Room facts',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
    {
      name: 'facts',
      title: 'Facts',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'fact',
          title: 'Fact',
          fields: [
            { name: 'n', title: 'Number', type: 'string' },
            { name: 't', title: 'Text', type: 'string' },
          ],
        },
      ],
    },
  ],
};

export const suppliersBlock = {
  name: 'suppliersBlock',
  title: 'Suppliers strip',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
    { name: 'headline', title: 'Headline', type: 'string' },
    { name: 'hint', title: 'Hint', type: 'string' },
    {
      name: 'suppliers',
      title: 'Suppliers',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'supplier',
          title: 'Supplier',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'desc', title: 'Description', type: 'string' },
            { name: 'img', title: 'Image', type: 'image', options: { hotspot: true }, fields: [altField] },
          ],
        },
      ],
    },
  ],
};

export const ctaBlock = {
  name: 'ctaBlock',
  title: 'Closing CTA',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
    { name: 'headline', title: 'Headline', type: 'text', rows: 2 },
    { name: 'primaryLabel', title: 'Primary label', type: 'string' },
    { name: 'primaryLink', title: 'Primary link', type: 'string' },
    { name: 'secondaryLabel', title: 'Secondary label', type: 'string' },
    { name: 'secondaryLink', title: 'Secondary link', type: 'string' },
  ],
};

export const visitIntroBlock = {
  name: 'visitIntroBlock',
  title: 'Visit intro',
  type: 'object',
  fields: [
    { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
    { name: 'headline', title: 'Headline', type: 'string' },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
    { name: 'note1', title: 'Note 1', type: 'string' },
    { name: 'note2', title: 'Note 2', type: 'string' },
    { name: 'note3', title: 'Note 3', type: 'string' },
  ],
};

export const blockTypes = [
  heroBlock,
  marqueeBlock,
  coursesBlock,
  assemblyBlock,
  storyPreviewBlock,
  menuHeaderBlock,
  letterBlock,
  factsBlock,
  suppliersBlock,
  ctaBlock,
  visitIntroBlock,
];
