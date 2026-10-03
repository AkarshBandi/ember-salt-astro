import type { APIRoute } from 'astro';

// Called by the Presentation tool (previewUrl.previewMode.enable).
// Sets the cross-site draft cookie and bounces the visitor to the draft
// render of the page they were previewing.
//
// The redirect must point at /preview/*, not the public URL: published pages
// are prerendered static files, and a cookie cannot turn a static file into a
// draft render. /preview/* is always dynamic.
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') ?? '/';
  const clean = slug.replace(/^\/+/, '').replace(/^preview\//, '');
  const target = clean ? `/preview/${clean}` : '/preview';

  // Optional shared secret guard. Set SANITY_PREVIEW_SECRET and the
  // Presentation tool's enable URL to /api/draft-mode/enable?secret=...
  const expected = import.meta.env.SANITY_PREVIEW_SECRET;
  if (expected && url.searchParams.get('secret') !== expected) {
    return new Response('Invalid preview secret', { status: 401 });
  }

  // CHIPS / SameSite=None+Secure: the cookie must survive inside the
  // Studio's cross-site iframe.
  const cookie = [
    '__sanity_draft=1',
    'Path=/',
    'Max-Age=86400',
    'SameSite=None',
    'Secure',
    'Partitioned',
  ].join('; ');

  return new Response(null, {
    status: 307,
    headers: {
      Location: target,
      'Set-Cookie': cookie,
      'Cache-Control': 'no-store',
    },
  });
};
