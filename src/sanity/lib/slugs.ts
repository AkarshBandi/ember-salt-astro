import { loadQuery } from './load-query';

// Build-time helpers.
//
// getStaticPaths() needs the list of published documents at BUILD time, before
// any page has rendered. These read the published perspective with the CDN,
// which the public dataset allows without a token.
//
// Every function swallows its own failure and returns an empty list: a Sanity
// hiccup during a build must not take the whole site down. The site keeps
// whatever static files the last successful build produced.

const PAGE_SLUGS = `*[_type == "page" && defined(slug.current)]{"slug": slug.current}`;

export async function listPageSlugs(): Promise<string[]> {
  try {
    const { data } = await loadQuery<{ slug: string }[]>({
      query: PAGE_SLUGS,
      draft: false,
    });
    return (data ?? []).map((d) => d.slug);
  } catch (e) {
    console.warn('[build] could not list page slugs; skipping dynamic pages', e);
    return [];
  }
}

const JOURNAL_SLUGS = `*[_type == "journalPost" && defined(slug.current)]{"slug": slug.current}`;

export async function listJournalSlugs(): Promise<string[]> {
  try {
    const { data } = await loadQuery<{ slug: string }[]>({
      query: JOURNAL_SLUGS,
      draft: false,
    });
    return (data ?? []).map((d) => d.slug);
  } catch (e) {
    console.warn('[build] could not list journal slugs; skipping journal pages', e);
    return [];
  }
}