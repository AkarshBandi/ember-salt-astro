import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { CmsActs, CmsGeneral } from './data';
import ActsIsland from '../../components/islands/ActsIsland.astro';
import GeneralIsland from '../../components/islands/GeneralIsland.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import { getActs, getGeneral } from './data';

export const islands: IslandRegistry = {
  acts: {
    fetch: () => getActs(),
    component: ActsIsland,
    wrapper: { tag: 'section' },
    propsFromData: (data) => ({
      acts: (data as QueryResult<{ acts: CmsActs }>).data?.acts,
    }),
  },
  general: {
    fetch: () => getGeneral(),
    component: GeneralIsland,
    wrapper: { tag: 'div' },
    propsFromData: (data) => ({
      general: (data as QueryResult<{ general: CmsGeneral }>).data?.general,
    }),
  },
  header: {
    fetch: () => getGeneral(),
    component: Header,
    wrapper: { tag: 'header' },
    propsFromData: (data) => ({
      general: (data as QueryResult<{ general: CmsGeneral }>).data?.general,
    }),
  },
  footer: {
    fetch: () => getGeneral(),
    component: Footer,
    wrapper: { tag: 'footer' },
    propsFromData: () => ({}),
  },
};
