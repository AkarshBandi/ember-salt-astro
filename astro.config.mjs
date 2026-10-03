import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

export default defineConfig({
  site: process.env.SITE_URL || 'https://ember-salt-astro.akarshbandi82.workers.dev',
  // Server-side rendered: draft mode and the Presentation preview
  // need per-request Sanity queries, so pages render on each request.
  // Every page falls back to its in-code English defaults when
  // Sanity is unreachable, so the site never shows a 500.

  output: 'server',

  // Hybrid: published pages are prerendered to static HTML (so an ordinary
  // visitor costs no Worker invocation and no Sanity request), while
  // /preview/* and /api/* render on demand for the draft view and the
  // rebuild webhook. Each page declares its own `export const prerender`.
  //
  // NOTE: middleware does NOT run for prerendered routes. That is why the
  // draft preview lives on its own /preview/* path instead of relying on a
  // cookie to switch a static page into a draft render.

  security: {
    // Astro's CSRF origin check rejects any POST whose Origin header does not
    // match the site, which includes every server-to-server request. Sanity's
    // publish webhook is exactly that: no Origin header, so the rebuild
    // endpoint answered 403 "Cross-site POST form submissions are forbidden"
    // and a publish could never reach the build.
    //
    // The only POST route on this site is /api/rebuild, and it authenticates
    // with a shared secret in a request header. A browser-based attacker cannot
    // read or forge that header, so the origin check adds no protection there
    // — it only broke the webhook. The booking form on /visit is client-side
    // only and posts nowhere.
    checkOrigin: false,
  },
  // 'file', not the default 'directory'.
  //
  // Astro's default emits menu/index.html, which makes Cloudflare 307 /menu to
  // /menu/ — so every internal link cost a round trip, and any canonical tag
  // would name a redirecting URL. 'file' emits menu.html instead, and
  // Cloudflare serves /menu directly while redirecting the .html alias. The
  // redirect then sits on the address nobody links to.
  build: { format: 'file' },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    mdx(),
    react(),
    sanity({
      projectId: '2527evag',
      dataset: 'production',
      useCdn: false,
      stega: {
        // The deployed Studio's public URL. Update this if you deploy
        // the studio/ folder under a different hostname.
        studioUrl: 'https://ember-salt.sanity.studio',
      },
    }),
  ],
  vite: {},
});
