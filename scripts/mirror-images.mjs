// Mirrors Sanity images into the static assets layer at build time.
//
// WHY: the published site is prerendered HTML served from Cloudflare's asset
// layer, where requests are free and unlimited and egress costs nothing. Sanity
// image bandwidth is the only traffic-linked cost left, so copying each image
// once per build removes it: the bytes are served by Cloudflare, not Sanity.
//
// The map is a lookup table from a Sanity asset reference to the local path, so
// normalize() can swap a cdn.sanity.io URL for /images/sanity/<name>.webp.
// Anything not in the map falls back to the Sanity CDN, which is correct but
// spends that budget, so a brand-new image appears from Sanity until the next
// build picks it up. Draft preview deliberately relies on that fallback: an
// editor checking an image they just uploaded should see the real file.
//
// THE INVARIANT: a map entry is only ever written for a file that exists on
// disk. The mirrored images are gitignored while the map is committed, so a
// clone without a token would otherwise ship HTML pointing at files that were
// never downloaded — every block image broken while the build still reported
// success. Verify every entry before writing, and drop the ones with no file.
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

const client = token
  ? createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      apiVersion: '2025-01-01',
      useCdn: false,
      token,
    })
  : null;

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

/** image-<id>-<w>x<h>-<ext>  ->  the filename and CDN URL we control. */
function parseRef(ref) {
  const m = /^image-([^-]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!m) return null;
  const [, id, dims, ext] = m;
  return {
    file: `${id}.${ext}`,
    cdnUrl: `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}`,
  };
}

function readExistingMap() {
  try {
    return JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeMap(map, { downloaded, bytes, refs }) {
  // The invariant, enforced: an entry survives only if its file is on disk.
  const verified = {};
  let dropped = 0;
  for (const [ref, localPath] of Object.entries(map)) {
    const onDisk = path.join(ROOT, 'public', localPath.replace(/^\//, ''));
    if (fs.existsSync(onDisk)) verified[ref] = localPath;
    else dropped += 1;
  }

  fs.writeFileSync(MAP_FILE, `${JSON.stringify(verified, null, 2)}\n`);

  if (dropped > 0) {
    console.log(
      `[mirror] ${dropped} map entries dropped: the image file is not in this build`,
    );
  }
  if (!client) {
    console.log(
      `[mirror] no SANITY_API_*_TOKEN; kept ${Object.keys(verified).length} ` +
        'entries, the rest fall back to the Sanity CDN',
    );
    return;
  }
  console.log(
    `[mirror] ${refs} referenced, ${downloaded} downloaded, ` +
      `${(bytes / 1024 / 1024).toFixed(2)} MB mirrored, ` +
      `${Object.keys(verified).length} of ${refs} served from the asset layer`,
  );
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  if (!client) {
    // Not fatal. A missing mirror must never be the reason a client's publish
    // fails to go live: reuse whatever files this machine already has, drop any
    // map entry whose file is absent, and let the rest fall back to Sanity.
    writeMap(readExistingMap(), { downloaded: 0, bytes: 0, refs: 0 });
    return;
  }

  const docs = await client.fetch(PUBLISHED_DOCS);
  const refs = [...new Set(collectRefs(docs))];

  const map = {};
  let downloaded = 0;
  let bytes = 0;

  for (const ref of refs) {
    const parsed = parseRef(ref);
    if (!parsed) {
      console.warn(`[mirror] skipping unrecognised reference: ${ref}`);
      continue;
    }

    const localPath = path.join(OUT_DIR, parsed.file);
    map[ref] = `/images/sanity/${parsed.file}`;

    if (fs.existsSync(localPath)) {
      bytes += fs.statSync(localPath).size;
      continue;
    }

    try {
      const res = await fetch(parsed.cdnUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(localPath, buffer);
      downloaded += 1;
      bytes += buffer.length;
    } catch (err) {
      // A single unreachable image must not fail the build; the verified map
      // drops it and normalize() falls back to the Sanity CDN URL.
      console.warn(`[mirror] could not fetch ${parsed.cdnUrl}: ${err.message}`);
      delete map[ref];
    }
  }

  writeMap(map, { downloaded, bytes, refs: refs.length });
}

main().catch((err) => {
  console.error('[mirror] failed:', err.message);
  process.exit(1);
});