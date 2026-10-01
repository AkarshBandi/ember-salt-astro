import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../../tina/__generated__/client';
import { PageDocument, ConfigDocument } from '../../../tina/__generated__/types.js';
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
    // The block dispatcher switches on __typename, which only the GraphQL
    // layer adds. The committed MDX carries `_template` instead, so without
    // this every block fell through the switch and rendered nothing — the
    // page came out with its header, footer and 32 editable fields but no
    // sections at all. TinaCMS names the type `PageBlocks` + PascalCase of
    // the template, so richText becomes PageBlocksRichText.
    const blocks = (parsed.blocks ?? []).map((b: any) =>
      b && b._template && !b.__typename
        ? { ...b, __typename: 'PageBlocks' + b._template.charAt(0).toUpperCase() + b._template.slice(1) }
        : b,
    );
    return {
      ...parsed,
      ...(parsed.blocks ? { blocks } : {}),
      _sys: { filename: slug, relativePath: `${slug}.mdx`, path: `src/content/page/${slug}.mdx`, extension: '.mdx' },
    };
  } catch (e) {
    console.warn(`local ${slug}.mdx parse failed`, e);
    return null;
  }
}

export const getConfig = async () => {
  // Same reasoning as getPage: the committed config.json is the truth.
  try {
    return await requestWithMetadata(
        // Same reasoning as getPage: the query is what builds the edit panel.
        Promise.resolve({ data: { config: configRaw }, query: ConfigDocument, variables: { relativePath: 'config.json' } } as any),
    );
  } catch {}
  return requestWithMetadata(client.queries.config({ relativePath: 'config.json' }));
};

export const getPage = async (slug: string) => {
  const local = localPage(slug);
  // LOCAL FIRST, deliberately. This is a git-backed CMS: Tina commits every
  // editor change to the branch, so the committed file IS the source of
  // truth. Querying the cloud first meant a branch TinaCloud had not
  // re-indexed yet silently won over the working tree — a colour fix pushed
  // three minutes earlier rendered the old value, and the build reported
  // success. Reading disk makes the build deterministic: what is deployed is
  // exactly what is committed, and a cloud that is behind cannot ship it.
  if (local) {
    return requestWithMetadata(
      // The QUERY is not optional metadata. Tina builds the left-hand edit panel
      // from it: it is the mapping that says which field in the schema owns
      // which `data-tina-field` in the HTML. Returning local data with
      // `query: ''` served a perfectly good preview and an empty panel reading
      // "TinaCMS form fields will appear here" — the two halves of visual
      // editing are wired together and only one of them was arriving.
      //
      // The DATA still comes off disk; only the query text comes from the
      // generated client, which costs no network round trip.

      Promise.resolve({ data: { page: local }, query: PageDocument, variables: { relativePath: `${slug}.mdx` } } as any),
      { priority: 'primary' },
    );
  }
  return requestWithMetadata(
    client.queries.page({ relativePath: `${slug}.mdx` }),
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
