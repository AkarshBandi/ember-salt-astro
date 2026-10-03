// Sanity stores images as {_type: 'image', asset: {_ref}, alt}.
//
// Most components on this site inherited a plain string URL from the Tina
// data layer (e.g. src={a?.img || '/images/dish-fire.webp'}), while Hero
// used a nested {src, alt} object. normalize() bridges the two:
//
//   - image fields whose name is in OBJECT_SHAPE become {src, alt}
//   - every other image field becomes a plain CDN URL string
//
const PROJECT_ID = '2527evag';
const DATASET = 'production';
const OBJECT_SHAPE = new Set(['plateImage', 'bgImage']);

function imageSrc(ref: string): string | null {
  const m = /^image-([^-]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!m) return null;
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${m[1]}-${m[2]}.${m[3]}`;
}

function fix(node: any, key?: string): any {
  if (Array.isArray(node)) return node.map((v) => fix(v));
  if (node && typeof node === 'object') {
    if (node._type === 'image' && node.asset?._ref) {
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
