import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tina from '@tinacms/astro/integration';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    tina(),
  ],
});
