import { defineMiddleware } from 'astro:middleware';

// Cloudflare edge caches the HTML briefly so transient Worker issues serve the
// last good copy instead of an error page.
//
// Two exceptions, both about never showing the wrong content:
//   - /preview/*  is a draft render and must never be cached anywhere.
//   - draft cookie present on any other route means an editor is looking at
//     unsaved work; caching that would show them stale text mid-edit.
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const response = await next();

  if (pathname.startsWith('/api/')) {
    return response;
  }

  const isPreview = pathname === '/preview' || pathname.startsWith('/preview/');
  const hasDraftCookie = context.cookies.get('__sanity_draft')?.value === '1';

  if (isPreview) {
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('Vary', 'Cookie');
  } else if (hasDraftCookie) {
    response.headers.set('Cache-Control', 'no-store');
  } else {
    response.headers.set(
      'Cache-Control',
      'public, max-age=30, stale-while-revalidate=300, stale-if-error=86400',
    );
  }
  return response;
});