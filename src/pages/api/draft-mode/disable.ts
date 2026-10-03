import type { APIRoute } from 'astro';

// Called to leave draft mode (Planning tool's disable URL).
export const GET: APIRoute = async () => {
  const cleared = [
    '__sanity_draft=',
    'Path=/',
    'Max-Age=0',
    'SameSite=None',
    'Secure',
    'Partitioned',
  ].join('; ');

  return new Response(null, {
    status: 307,
    headers: {
      Location: '/',
      // Clear both the partitioned and the plain name, in case the
      // browser only accepted one.
      'Set-Cookie': cleared,
      'Cache-Control': 'no-store',
    },
  });
};
