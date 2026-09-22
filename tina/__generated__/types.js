export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const PagePartsFragmentDoc = gql`
    fragment PageParts on Page {
  __typename
  seoTitle
  blocks {
    __typename
    ... on PageBlocksHero {
      eyebrow
      miles
      tagline
      primaryLabel
      primaryLink
      secondaryLabel
      secondaryLink
      scrollNote
      plateImage {
        __typename
        src
        alt
      }
    }
    ... on PageBlocksMarquee {
      phrases {
        __typename
        text
      }
    }
    ... on PageBlocksCourses {
      eyebrow
      headline
      description
      layout
      courses {
        __typename
        n
        numeral
        time
        name
        sense
        line
        img
        imgB
        accent
        choice
      }
    }
    ... on PageBlocksAssembly {
      eyebrow
      caption
      badge
      image
      plateSrc
      steps {
        __typename
        n
        title
        text
      }
    }
    ... on PageBlocksStoryPreview {
      eyebrow
      headline
      body1
      body2
      estLabel
      ctaLabel
      ctaLink
      image
      nameplate
      quote
    }
    ... on PageBlocksMenuHeader {
      eyebrow
      headline1
      headline2
      description
      background
    }
    ... on PageBlocksLetter {
      eyebrow
      headline
      marginNote
      para1
      para2
      signoff
    }
    ... on PageBlocksFacts {
      eyebrow
      facts {
        __typename
        n
        t
      }
    }
    ... on PageBlocksSuppliers {
      eyebrow
      headline
      hint
      suppliers {
        __typename
        name
        desc
        img
      }
    }
    ... on PageBlocksCta {
      eyebrow
      headline
      primaryLabel
      primaryLink
      secondaryLabel
      secondaryLink
    }
    ... on PageBlocksVisitIntro {
      eyebrow
      headline
      description
      note1
      note2
      note3
    }
  }
}
    `;
export const JournalPartsFragmentDoc = gql`
    fragment JournalParts on Journal {
  __typename
  title
  date
  category
  description
  image
  body
}
    `;
export const ConfigPartsFragmentDoc = gql`
    fragment ConfigParts on Config {
  __typename
  seo {
    __typename
    title
    description
  }
  nav {
    __typename
    title
    link
  }
  footer {
    __typename
    ctaEyebrow
    ctaHeadline
    ctaText
    phone
    email
    address1
    address2
  }
}
    `;
export const PageDocument = gql`
    query page($relativePath: String!) {
  page(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PageParts
  }
}
    ${PagePartsFragmentDoc}`;
export const PageConnectionDocument = gql`
    query pageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PageFilter) {
  pageConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PageParts
      }
    }
  }
}
    ${PagePartsFragmentDoc}`;
export const JournalDocument = gql`
    query journal($relativePath: String!) {
  journal(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...JournalParts
  }
}
    ${JournalPartsFragmentDoc}`;
export const JournalConnectionDocument = gql`
    query journalConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: JournalFilter) {
  journalConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...JournalParts
      }
    }
  }
}
    ${JournalPartsFragmentDoc}`;
export const ConfigDocument = gql`
    query config($relativePath: String!) {
  config(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ConfigParts
  }
}
    ${ConfigPartsFragmentDoc}`;
export const ConfigConnectionDocument = gql`
    query configConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ConfigFilter) {
  configConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ConfigParts
      }
    }
  }
}
    ${ConfigPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    page(variables, options) {
      return requester(PageDocument, variables, options);
    },
    pageConnection(variables, options) {
      return requester(PageConnectionDocument, variables, options);
    },
    journal(variables, options) {
      return requester(JournalDocument, variables, options);
    },
    journalConnection(variables, options) {
      return requester(JournalConnectionDocument, variables, options);
    },
    config(variables, options) {
      return requester(ConfigDocument, variables, options);
    },
    configConnection(variables, options) {
      return requester(ConfigConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
