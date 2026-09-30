import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../../tina/__generated__/client';
import { load as yamlLoad } from 'js-yaml';

// TinaCloud returns EMPTY data rather than throwing while it is still
// indexing a branch, and it serves the previous commit's content until it
// finishes. Either way the build quietly ships stale copy: a colour fixed in
// the MDX kept rendering the old value for minutes after the push. Reading
// the same files off disk and preferring them over a cloud response that is
// behind the working tree makes the build deterministic.
import homeRaw from '../../content/page/home.mdx?raw';
import menuRaw from '../../content/page/menu.mdx?raw';
import storyRaw from '../../content/page/story.mdx?raw';
import visitRaw from '../../content/page/visit.mdx?raw';
import configRaw from '../../content/config/config.json';

const raws: Record<string, string> = {
  home: homeRaw as any,
  menu: menuRaw as any,
  story: storyRaw as any,
  visit: visitRaw as any,
};

function stripFrontmatter(raw: string) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  return m ? m[1] : raw;
}

function localPage(slug: string) {
  const raw = raws[slug];
  if (!raw) return null;
  try {
    const parsed = yamlLoad(stripFrontmatter(raw)) as any;
    return {
      ...parsed,
      _sys: { filename: slug, relativePath: `${slug}.mdx`, path: `src/content/page/${slug}.mdx`, extension: '.mdx' },
    };
  } catch (e) {
    console.warn(`local ${slug}.mdx parse failed`, e);
    return null;
  }
}

export const getConfig = async () => {
  try {
    const r = await requestWithMetadata(client.queries.config({ relativePath: 'config.json' }));
    if (r?.data?.config) return r;
  } catch {}
  return requestWithMetadata(
    Promise.resolve({ data: { config: configRaw }, query: '', variables: {} } as any),
  );
};

export const getPage = async (slug: string) => {
  const local = localPage(slug);
  try {
    const r = await requestWithMetadata(client.queries.page({ relativePath: `${slug}.mdx` }), {
      priority: 'primary',
    });
    if (r?.data?.page) return r;
  } catch {}
  return requestWithMetadata(
    Promise.resolve({ data: { page: local }, query: '', variables: { relativePath: `${slug}.mdx` } } as any),
    { priority: 'primary' },
  );
};

export const getJournal = (slug: string) =>
  requestWithMetadata(client.queries.journal({ relativePath: `${slug}.md` }), {
    priority: 'primary',
  });

export async function listPages() {
  const result = await client.queries.pageConnection();
  return (result.data.pageConnection.edges ?? []).flatMap((edge) =>
    edge?.node ? [edge.node] : []
  );
}

export async function listJournal() {
  const result = await client.queries.journalConnection();
  return (result.data.journalConnection.edges ?? [])
    .flatMap((edge) => (edge?.node ? [edge.node] : []))
    .sort((a, b) => {
      const ad = a?.date ? new Date(a.date).valueOf() : 0;
      const bd = b?.date ? new Date(b.date).valueOf() : 0;
      return bd - ad;
    });
}

export type CmsConfig = Awaited<ReturnType<typeof getConfig>>['data']['config'];
export type CmsPage = Awaited<ReturnType<typeof getPage>>['data']['page'];
export type CmsJournal = Awaited<ReturnType<typeof getJournal>>['data']['journal'];

export type PageBlock = NonNullable<NonNullable<CmsPage['blocks']>[number]>;
export type PageBlockTypename = PageBlock['__typename'];
