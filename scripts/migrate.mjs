// One-off migration: Tina MDX/JSON  ->  Sanity (project 2527evag).
// Usage: SANITY_API_WRITE_TOKEN=... node scripts/migrate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { load as yaml } from 'js-yaml';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error('Set SANITY_API_WRITE_TOKEN (Viewer/Editor token) env var.');
  process.exit(1);
}

const client = createClient({
  projectId: '2527evag',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token,
});

// Tina `_template` -> Sanity block type.
const BLOCK = {
  hero: 'heroBlock',
  marquee: 'marqueeBlock',
  courses: 'coursesBlock',
  assembly: 'assemblyBlock',
  storyPreview: 'storyPreviewBlock',
  menuHeader: 'menuHeaderBlock',
  letter: 'letterBlock',
  facts: 'factsBlock',
  suppliers: 'suppliersBlock',
  cta: 'ctaBlock',
  visitIntro: 'visitIntroBlock',
};

// image-ish fields -> Sanity image objects
const IMG_STRING_FIELDS = new Set(['img', 'imgB', 'image', 'plateSrc', 'background']);
const IMG_OBJECT_FIELDS = new Set(['plateImage', 'bgImage']);

const assetCache = new Map();
async function uploadImage(srcPath) {
  const rel = srcPath.replace(/^\//, '');
  const abs = path.join(PUBLIC_DIR, rel);
  if (!fs.existsSync(abs)) {
    console.warn(`missing file ${abs}; skipping`);
    return null;
  }
  if (assetCache.has(abs)) return assetCache.get(abs);
  const asset = await client.assets.upload('image', fs.createReadStream(abs), {
    filename: path.basename(abs),
  });
  const ref = asset._id;
  assetCache.set(abs, ref);
  return ref;
}

async function convertImage(value) {
  if (value == null) return undefined;
  let src = typeof value === 'string' ? value : value?.src;
  const alt = typeof value === 'object' ? value?.alt : undefined;
  if (!src || !src.startsWith('/images/')) return undefined;
  const ref = await uploadImage(src);
  if (!ref) return undefined;
  return { _type: 'image', asset: { _type: 'reference', _ref: ref }, ...(alt ? { alt } : {}) };
}

async function convertBlock(block) {
  const out = { _type: BLOCK[block._template] ?? `${block._template}Block`, _key: crypto.randomUUID().slice(0, 8) };
  for (const [k, v] of Object.entries(block)) {
    if (k === '_template') continue;
    if (Array.isArray(v)) {
      out[k] = [];
      for (const item of v) {
        if (item && typeof item === 'object') {
          const conv = {};
          for (const [ik, iv] of Object.entries(item)) {
            if (IMG_STRING_FIELDS.has(ik)) conv[ik] = await convertImage(iv);
            else conv[ik] = iv;
          }
          out[k].push({ _type: 'object', _key: crypto.randomUUID().slice(0, 8), ...conv });
        } else out[k].push(item);
      }
    } else if (v && typeof v === 'object' && ('src' in v || 'alt' in v) && IMG_OBJECT_FIELDS.has(k)) {
      out[k] = await convertImage(v);
    } else if (IMG_STRING_FIELDS.has(k) && typeof v === 'string') {
      out[k] = await convertImage(v);
    } else if (IMG_OBJECT_FIELDS.has(k) && v && typeof v === 'object') {
      out[k] = await convertImage(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

function stripFrontmatter(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  return m ? m[1] : raw;
}

async function migratePage(slug) {
  const raw = fs.readFileSync(path.join(ROOT, 'src/content/page', `${slug}.mdx`), 'utf8');
  const parsed = yaml(stripFrontmatter(raw));
  const blocks = [];
  for (const b of parsed.blocks ?? []) blocks.push(await convertBlock(b));
  const doc = {
    _id: `page-${slug}`,
    _type: 'page',
    seoTitle: parsed.seoTitle,
    slug: { _type: 'slug', current: slug },
    blocks,
  };
  await client.createOrReplace(doc);
  console.log(`page: ${slug} (${blocks.length} blocks)`);
}

async function migrateConfig() {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/config/config.json'), 'utf8'));
  // config schema mirrors this shape; pass through as-is (fields match config.ts)
  const doc = { _id: 'config', _type: 'config', ...raw };
  await client.createOrReplace(doc);
  console.log('config');
}

async function migrateJournal() {
  const dir = path.join(ROOT, 'src/content/journal');
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    const front = m ? yaml(m[1]) : {};
    const body = m ? m[2].trim() : raw;
    const image = await convertImage(front.image);
    const doc = {
      _id: `journal-${path.basename(f, '.md')}`,
      _type: 'journalPost',
      title: front.title,
      slug: { _type: 'slug', current: path.basename(f, '.md') },
      date: front.date instanceof Date ? front.date.toISOString() : front.date,
      category: front.category,
      description: front.description,
      body,
      ...(image ? { image } : {}),
    };
    await client.createOrReplace(doc);
    console.log(`journal: ${f}`);
  }
}

const pages = ['home', 'menu', 'story', 'visit'];
for (const p of pages) await migratePage(p);
await migrateConfig();
await migrateJournal();
console.log('Done.');
