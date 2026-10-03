// NOTE: do not import QueryParams from 'sanity' here. That pulls the whole
// Studio package into the Worker bundle, which then calls nanoid() at module
// scope — a global-scope random call that Workers reject at runtime (1101).
import { sanityClient } from 'sanity:client';

type QueryParams = Record<string, unknown>;

/**
 * The single data entry point for page content.
 *
 * - Draft mode (the /preview/* route): perspective 'drafts', stega overlays
 *   on, read token attached, no CDN — so an editor's unpublished change is
 *   what renders.
 * - Everyone else: published content, prerendered to a static file at build
 *   time, so this function is not even called for ordinary visitors.
 */
export async function loadQuery<QueryResponse>({
  query,
  params,
  draft,
  token,
}: {
  query: string;
  params?: QueryParams;
  draft: boolean;
  // Supplied by the caller from the request's runtime env (a Worker secret).
  // import.meta.env would be baked in at build time and is absent in CI.
  token?: string;
}) {
  if (draft && !token) {
    throw new Error(
      'SANITY_API_READ_TOKEN is required to render drafts. Set it as a Worker secret.',
    );
  }

  const perspective = draft ? 'drafts' : 'published';

  const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(
    query,
    params ?? {},
    {
      filterResponse: false,
      perspective,
      resultSourceMap: draft ? 'withKeyArraySelector' : false,
      stega: draft,
      ...(draft ? { token } : {}),
      useCdn: !draft,
    },
  );

  return { data: result, sourceMap: resultSourceMap, perspective };
}