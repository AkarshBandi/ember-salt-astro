import type { APIRoute } from 'astro';
import { envValue } from '../../lib/runtime-env';

// Publish -> rebuild.
//
// Sanity cannot build a site and this Worker cannot run a build, so the
// request is forwarded to GitHub Actions, which owns the build:
//
//   Sanity publish -> webhook -> /api/rebuild -> repository_dispatch
//                                                -> deploy.yml -> wrangler deploy
//
// The GitHub token never leaves Cloudflare's secret store and is never given
// to Sanity: Sanity only knows this URL and the shared secret.
//
// Drafts are ignored. Sanity's dataset webhook fires on draft saves as well as
// publishes, and every build costs a couple of minutes of the free allowance,
// so a client typing in the Studio must not rebuild the site. The prerendered
// site reads published documents only, so a draft-triggered build would produce
// identical output anyway — skipping it is free.
//
// Secrets (set with `wrangler secret put <name>`):
//   REBUILD_SECRET  random string; Sanity sends it as the x-rebuild-secret header
//   GITHUB_TOKEN    PAT with `workflow` write on this repo
//
// The nightly safety net is the `schedule:` entry in .github/workflows/deploy.yml
// rather than a Worker cron, so the fast path and the net run the same job.

const REPO = 'AkarshBandi/ember-salt-astro';
const EVENT_TYPE = 'sanity-publish';

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Collect every _id in a webhook payload. A Sanity draft document's id starts
 * with "drafts.", so "every id seen is a draft" means nothing was published.
 * Returns null when no id can be found, which we treat as "cannot tell" and
 * therefore allow the build through.
 */
function collectIds(node: unknown, out: string[] = []): string[] {
  if (Array.isArray(node)) {
    for (const item of node) collectIds(item, out);
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (key === '_id' && typeof value === 'string') out.push(value);
      else collectIds(value, out);
    }
  }
  return out;
}

function isDraftOnly(body: string): boolean {
  if (!body) return false;
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return false; // unparseable payload: do not block a rebuild on a guess
  }
  const ids = collectIds(parsed);
  if (ids.length === 0) return false;
  return ids.every((id) => id.startsWith('drafts.'));
}

const handler: APIRoute = async (context) => {
  const { request } = context;

  const expected = await envValue(context, 'REBUILD_SECRET');
  if (!expected) {
    return new Response('REBUILD_SECRET is not set on this Worker', { status: 500 });
  }

  const url = new URL(request.url);
  const provided = request.headers.get('x-rebuild-secret') ?? url.searchParams.get('secret') ?? '';
  if (!timingSafeEqual(provided, expected)) {
    return new Response('Forbidden', { status: 401 });
  }

  const body = request.method === 'POST' ? await request.text().catch(() => '') : '';
  if (isDraftOnly(body)) {
    return new Response(null, { status: 202, headers: { 'X-Rebuild': 'skipped-draft' } });
  }

  const token = await envValue(context, 'GITHUB_TOKEN');
  if (!token) {
    return new Response('GITHUB_TOKEN is not set on this Worker', { status: 500 });
  }

  const res = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ember-salt-rebuild',
    },
    body: JSON.stringify({
      event_type: EVENT_TYPE,
      client_payload: {
        reason: request.method === 'GET' ? 'manual-smoke-test' : 'sanity-publish',
        at: new Date().toISOString(),
      },
    }),
  });

  // 204 is GitHub's success response for repository_dispatch.
  if (!res.ok) {
    return new Response(`GitHub refused the dispatch (${res.status})`, { status: 502 });
  }
  return new Response(null, { status: 202 });
};

export const POST = handler;
// GET exists so the endpoint can be smoke-tested from a browser with ?secret=...
export const GET = handler;