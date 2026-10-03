import { defineConfig } from 'sanity';
import { createElement, Fragment } from 'react';
import { structureTool } from 'sanity/structure';
import { defineLocations, presentationTool } from 'sanity/presentation';
import { structure } from './structure';
import { schemaTypes } from './schemaTypes';

// Minimal custom navbar: same default navbar UI, but the top-right chrome
// (user badge / notifications / help) is hidden for a cleaner, plain-English bar.
function Navbar(props: any) {
  return createElement(
    Fragment,
    null,
    createElement('style', null, `
        [class*="UserMenu"], [aria-label="User menu"], [aria-label="Notifications"], [class*="notifications"] { display: none !important; }
      `),
    props.renderDefault(props),
  );
}

// Iframe preview pane for documents: left pane preview, right pane form.
function IframePreview(props: { document?: { displayed?: any } }) {
  const displayed = props?.document?.displayed;
  const slug = displayed?.slug?.current;
  const base =
    process.env.SANITY_STUDIO_PREVIEW_URL ||
    'https://ember-salt-astro.akarshbandi82.workers.dev';
  const src = slug ? `${base}/${slug === 'home' ? '' : slug}` : base;
  return createElement('iframe', {
    src,
    title: 'Preview',
    style: { width: '100%', height: '100%', border: 'none' },
  });
}

export default defineConfig({
  name: 'ember-salt',
  title: 'Ember & Salt',
  projectId: '2527evag',
  dataset: 'production',
  plugins: [
    structureTool({
      structure,
      defaultDocumentNode: (S: any, { schemaType }: { schemaType: string }) => {
        if (schemaType === 'config') {
          return S.document().views([S.view.form()]);
        }
        return S.document().views([
          S.view.component(IframePreview).title('Preview'),
          S.view.form(),
        ]);
      },
    }),
    presentationTool({
      previewUrl: {
        // The /preview/* base URL, NOT the public site.
        //
        // Published pages are prerendered static files and Astro middleware
        // never runs for them, so a draft cookie cannot switch a public page
        // into a draft render. /preview/* is a separate, always-dynamic route
        // that renders the drafts perspective, which is why the preview lives
        // on its own path.
        initial:
          process.env.SANITY_STUDIO_PREVIEW_URL ||
          'https://ember-salt-astro.akarshbandi82.workers.dev/preview',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve: {
        locations: {
          page: defineLocations({
            select: { title: 'seoTitle', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Home',
                  href: doc?.slug ? `/${doc.slug}` : '/',
                },
              ],
            }),
          }),
          journalPost: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Journal entry',
                  href: `/journal/${doc?.slug ?? ''}`,
                },
              ],
            }),
          }),
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
  studio: {
    components: {
      navbar: Navbar,
    },
  },
  mediaLibrary: { enabled: false },
  tasks: { enabled: false },
  scheduledPublishing: { enabled: false },
  scheduledDrafts: { enabled: false },
  releases: { enabled: false },
  document: { comments: { enabled: false } },
} as any);
