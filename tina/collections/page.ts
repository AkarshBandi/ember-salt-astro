import type { Collection } from 'tinacms';
import { heroBlockSchema } from '../../src/components/blocks/hero.template';
import { marqueeBlockSchema } from '../../src/components/blocks/marquee.template';
import { coursesBlockSchema } from '../../src/components/blocks/courses.template';
import { assemblyBlockSchema } from '../../src/components/blocks/assembly.template';
import { storyPreviewBlockSchema } from '../../src/components/blocks/storyPreview.template';
import { menuHeaderBlockSchema } from '../../src/components/blocks/menuHeader.template';
import { letterBlockSchema } from '../../src/components/blocks/letter.template';
import { factsBlockSchema } from '../../src/components/blocks/facts.template';
import { suppliersBlockSchema } from '../../src/components/blocks/suppliers.template';
import { ctaBlockSchema } from '../../src/components/blocks/cta.template';
import { visitIntroBlockSchema } from '../../src/components/blocks/visitIntro.template';

export const PageCollection: Collection = {
  name: 'page',
  label: 'Pages',
  path: 'src/content/page',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === 'home') return '/';
      return `/${document._sys.filename}`;
    },
  },
  fields: [
    {
      name: 'seoTitle',
      label: 'Meta title (SEO)',
      type: 'string',
      isTitle: true,
      required: true,
    },
    {
      type: 'object',
      list: true,
      name: 'blocks',
      label: 'Page sections',
      ui: { visualSelector: true },
      templates: [
        heroBlockSchema,
        marqueeBlockSchema,
        coursesBlockSchema,
        assemblyBlockSchema,
        storyPreviewBlockSchema,
        menuHeaderBlockSchema,
        letterBlockSchema,
        factsBlockSchema,
        suppliersBlockSchema,
        ctaBlockSchema,
        visitIntroBlockSchema,
      ],
    },
  ],
};
