import { loadQuery } from '../sanity/lib/load-query';
import { normalize } from '../sanity/lib/normalize';

// Same shape the old data layer returned, so components barely change:
//   getPage('home')      -> { data: { page: {...} | null } }
//   getConfig()          -> { data: { config: {...} | null } }
//   getJournal('slug')   -> { data: { journal: {...} | null } }
//   getJournalList()     -> { data: { entries: [...] } }

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _id, seoTitle, "slug": slug.current, blocks[]
}`;

export async function getPage(slug: string, draft = false, token?: string) {
  try {
    const { data } = await loadQuery<any>({ query: PAGE_QUERY, params: { slug }, draft, token });
    return { data: { page: data ? normalize(data) : null } };
  } catch (e) {
    console.warn(`getPage('${slug}') failed; rendering defaults`, e);
    return { data: { page: null } };
  }
}

const CONFIG_QUERY = `*[_type == "config"][0]`;

export async function getConfig(draft = false, token?: string) {
  try {
    const { data } = await loadQuery<any>({ query: CONFIG_QUERY, draft, token });
    return { data: { config: data ? normalize(data) : null } };
  } catch (e) {
    console.warn('getConfig failed; rendering defaults', e);
    return { data: { config: null } };
  }
}

const JOURNAL_QUERY = `*[_type == "journalPost" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, date, category, description, body,
  "image": image{asset}
}`;

export async function getJournal(slug: string, draft = false, token?: string) {
  try {
    const { data } = await loadQuery<any>({ query: JOURNAL_QUERY, params: { slug }, draft, token });
    return { data: { journal: data ?? null } };
  } catch (e) {
    console.warn(`getJournal('${slug}') failed`, e);
    return { data: { journal: null } };
  }
}

const JOURNAL_LIST_QUERY = `*[_type == "journalPost"] | order(date desc) {
  _id, title, "slug": slug.current, date, category, description,
  "image": image{asset}
}`;

export async function getJournalList(draft = false, token?: string) {
  try {
    const { data } = await loadQuery<any[]>({ query: JOURNAL_LIST_QUERY, draft, token });
    // normalize() is what turns a Sanity asset reference into a served image
    // path. Skipping it here left the journal thumbnails rendering as
    // "[object Object]".
    return { data: { entries: normalize(data ?? []) } };
  } catch (e) {
    console.warn('getJournalList failed', e);
    return { data: { entries: [] as any[] } };
  }
}
