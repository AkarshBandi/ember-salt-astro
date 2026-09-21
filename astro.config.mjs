import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tina from '@tinacms/astro/integration';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    tina(),
  ],
});
