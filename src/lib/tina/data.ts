import { requestWithMetadata } from '@tinacms/astro/data';
import client from '../../../tina/__generated__/client';

export const getGeneral = () =>
  requestWithMetadata(
    client.queries.general({ relativePath: 'general.yaml' }),
    { priority: 'primary' }
  );

export const getActs = () =>
  requestWithMetadata(
    client.queries.acts({ relativePath: 'acts.yaml' }),
    { priority: 'primary' }
  );

export const getJournal = (slug: string) =>
  requestWithMetadata(
    client.queries.journal({ relativePath: `${slug}.md` }),
    { priority: 'primary' }
  );

export async function listJournal() {
  const result = await client.queries.journalConnection();
  return (result.data.journalConnection.edges ?? [])
    .flatMap((edge) => (edge?.node ? [edge.node] : []));
}

export type CmsGeneral = Awaited<ReturnType<typeof getGeneral>>['data']['general'];
export type CmsActs = Awaited<ReturnType<typeof getActs>>['data']['acts'];
export type CmsJournal = Awaited<ReturnType<typeof getJournal>>['data']['journal'];
export type CmsAct = NonNullable<NonNullable<CmsActs['courses']>[number]>;
