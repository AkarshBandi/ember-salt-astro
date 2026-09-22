import { defineConfig } from 'tinacms';
import { PageCollection } from './collections/page';
import { JournalCollection } from './collections/journal';
import { GlobalCollection } from './collections/global';

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.WORKERS_CI_BRANCH ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,

  clientId: process.env.PUBLIC_TINA_CLIENT_ID!,
  token: process.env.TINA_TOKEN!,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: '',
    },
  },
  schema: {
    collections: [PageCollection, JournalCollection, GlobalCollection],
  },
});
