# Ember & Salt Studio

Sanity Studio for the Ember & Salt site (project `2527evag`, dataset `production`).

## Deploy

```bash
cd studio
npm install
npm run deploy
```

`npm run dev` runs the studio locally; `npm run build` produces a static build.
Set `SANITY_STUDIO_PREVIEW_URL` to the deployed site URL for the document preview iframe,
and make sure `/api/draft-mode/enable` and `/api/draft-mode/disable` routes exist on the site.
