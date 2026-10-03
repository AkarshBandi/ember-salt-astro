// Mirrors Sanity images into the static assets layer at build time.
//
// WHY: the published site is prerendered HTML served from Cloudflare's asset
// layer, where requests are free and unlimited and egress costs nothing. Sanity
// image bandwidth is the only traffic-linked cost left, and copying each image
// once per build removes it: the bytes are served by Cloudflare, not Sanity.
//
// The map is a lookup table from a Sanity asset reference to the local path, so
// normalize() can swap a cdn.sanity.io URL for /images/sanity/<name>.webp.
//
// New images appear on the next build — which a publish triggers within about a
// minute, so an editor sees a new photo go live at the same moment as their
// text. Draft preview deliberately does NOT use the map: an editor checking an
// image they just uploaded should see the real file from Sanity, not a mirror
// from the previous build.
//
// Usage: node scripts/mirror-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

const PROJECT_ID = '2527evag';
const DATASET = 'production';
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'sanity');
const MAP_FILE = path.join(ROOT, 'src', 'sanity', 'lib', 'image-map.json');

const token =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
if (!token) {
  console.error('Set SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN.');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-01-01',
  useCdn: false,
  token,
});

// Only images reachable from PUBLISHED content are mirrored, so an orphaned
// asset or an unsaved draft never bloats the deploy.
//
// The documents are fetched whole and walked in JS rather than projected with
// GROQ: a projection has to know every nesting level of every block, so adding a
// new section type would silently drop its images. Walking the object cannot.
const PUBLISHED_DOCS = `*[_type in ["page", "journalPost", "config"] && !(_id in path("drafts.**"))]`;

/** Every image reference reachable from published documents. */
function collectRefs(node, out = []) {
  if (Array.isArray(node)) {
    for (const item of node) collectRefs(item, out);
  } else if (node && typeof node === 'object') {
    if (typeof node.asset?._ref === 'string') out.push(node.asset._ref);
    for (const value of Object.values(node)) collectRefs(value, out);
  }
  return out;
}

/** image-<id>-<w>x<h>-<ext>  ->  a filename we control. */
function refToFile(ref) {
  const m = /^image-([^-]+)-\d+x\d+-(\w+)$/.exec(ref);
  if (!m) return null;
  const [, id, ext] = m;
  return `${id}.${ext}`;
}

function refToCdnUrl(ref) {
  const file = refToFile(ref);
  if (!file) return null;
  const id = file.slice(0, file.lastIndexOf('.'));
  const m = /^image-([^-]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${m[2]}.${m[3]}`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const docs = await client.fetch(PUBLISHED_DOCS);
  const refs = [...new Set(collectRefs(docs))];

  const map = {};
  let downloaded = 0;
  let bytes = 0;

  for (const ref of refs) {
    const file = refToFile(ref);
    const url = refToCdnUrl(ref);
    if (!file || !url) {
      console.warn(`[mirror] skipping unrecognised reference: ${ref}`);
      continue;
    }

    const localPath = path.join(OUT_DIR, file);
    map[ref] = `/images/sanity/${file}`;

    if (fs.existsSync(localPath)) {
      bytes += fs.statSync(localPath).size;
      continue;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(localPath, buffer);
      downloaded += 1;
      bytes += buffer.length;
    } catch (err) {
      // A single unreachable image must not fail the whole build. The site
      // falls back to the Sanity CDN URL for anything missing from the map.
      console.warn(`[mirror] could not fetch ${url}: ${err.message}`);
      delete map[ref];
    }
  }

  fs.writeFileSync(MAP_FILE, `${JSON.stringify(map, null, 2)}\n`);
  console.log(
    `[mirror] ${refs.length} referenced, ${downloaded} downloaded, ` +
      `${(bytes / 1024 / 1024).toFixed(2)} MB mirrored, map has ${Object.keys(map).length}`,
  );
}

main().catch((err) => {
  console.error('[mirror] failed:', err.message);
  process.exit(1);
});