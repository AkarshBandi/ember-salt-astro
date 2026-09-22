import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../../tina/__generated__/client';

export const getConfig = () =>
  requestWithMetadata(client.queries.config({ relativePath: 'config.json' }));

export const getPage = (slug: string) =>
  requestWithMetadata(client.queries.page({ relativePath: `${slug}.mdx` }), {
    priority: 'primary',
  });

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
