import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { PageQuery, JournalQuery } from '../../../tina/__generated__/types';
import type { CmsPage, CmsJournal } from './data';
import PageBody from '../../components/islands/PageBody.astro';
import BlogBody from '../../components/islands/BlogBody.astro';
import { getPage, getJournal } from './data';

export const islands: IslandRegistry = {
  page: {
    fetch: (_request, params) => getPage(params.get('slug') ?? 'home'),
    component: PageBody,
    wrapper: { tag: 'main', className: 'linen' },
    propsFromData: (data) => ({
      data: (data as QueryResult<PageQuery>).data?.page as CmsPage | undefined,
    }),
  },
  journal: {
    fetch: (_request, params) => getJournal(params.get('slug') ?? ''),
    component: BlogBody,
    wrapper: { tag: 'article' },
    propsFromData: (data) => ({
      data: (data as QueryResult<JournalQuery>).data?.journal as CmsJournal | undefined,
    }),
  },
};
