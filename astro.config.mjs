import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

export default defineConfig({
  site: process.env.SITE_URL || 'https://ember-salt-astro.akarshbandi82.workers.dev',
  // 'server', not 'static'.
  //
  // In static output Astro prerenders every route, and a route marked
  // `export const prerender = false` is dropped rather than built — so the Tina
  // island route silently vanished from dist/ and the deployed Worker had no
  // POST endpoint at all. That is why the admin's left panel showed "TinaCMS
  // form fields will appear here": the panel is built from the island response,
  // and there was no response. The right-hand preview worked because that
  // renders from the static HTML.
  //
  // This is the hybrid shape: every content page below carries
  // `export const prerender = true` and is served as static HTML, while the
  // island stays a live route.
  output: 'server',
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
  integrations: [mdx(), tina()],
  image: {
    remotePatterns: [{ protocol: 'https', hostname: 'assets.tina.io' }],
  },
  vite: {
    plugins: [tinaAdminDevRedirect()],
    ssr: {
      noExternal: ['@tinacms/astro', '@tinacms/bridge'],
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
            warning.exporter === 'tinacms/dist/client'
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
