import imageMap from './image-map.json';

// Sanity stores images as {_type: 'image', asset: {_ref}, alt}.
//
// Prerendered pages are served from Cloudflare's asset layer, where requests are
// free and unlimited, so images are mirrored into it at build time by
// scripts/mirror-images.mjs and served from /images/sanity/. That removes image
// bandwidth from Sanity's 100GB/month budget entirely.
//
// The map only knows images that existed at the last build, and draft preview
// needs to show an upload the moment it lands, so anything missing from the map
// falls back to the Sanity CDN URL.
//
// Most components on this site inherited a plain string URL from the Tina data
// layer (e.g. src={a?.img || '/images/dish-fire.webp'}), while Hero used a
// nested {src, alt} object. normalize() bridges the two:
//
//   - image fields whose name is in OBJECT_SHAPE become {src, alt}
//   - every other image field becomes a plain URL string
//
const PROJECT_ID = '2527evag';
const DATASET = 'production';
const OBJECT_SHAPE = new Set(['plateImage', 'bgImage']);

const LOCAL = imageMap as Record<string, string>;

function imageSrc(ref: string): string | null {
  const local = LOCAL[ref];
  if (local) return local;

  const m = /^image-([^-]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!m) return null;
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${m[1]}-${m[2]}.${m[3]}`;
}

function fix(node: any, key?: string): any {
  if (Array.isArray(node)) return node.map((v) => fix(v));
  if (node && typeof node === 'object') {
    // Matched on asset._ref rather than _type === 'image': a GROQ projection
    // like `image{asset}` returns the asset reference without the _type, and
    // treating that as a plain object silently produced an empty src.
    if (typeof node.asset?._ref === 'string') {
      const src = imageSrc(node.asset._ref);
      if (key && OBJECT_SHAPE.has(key)) {
        return { src, alt: node.alt ?? '' };
      }
      return src;
    }
    const out: Record<string, any> = {};
    for (const k of Object.keys(node)) out[k] = fix(node[k], k);
    return out;
  }
  return node;
}

/** Recursively decode Sanity image refs into the shape templates expect. */
export function normalize<T>(value: T): T {
  return fix(value);
}