export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const GeneralPartsFragmentDoc = gql`
    fragment GeneralParts on General {
  __typename
  seo_title
  description
  nav_links {
    __typename
    label
    href
  }
}
    `;
export const ActsPartsFragmentDoc = gql`
    fragment ActsParts on Acts {
  __typename
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
export const GeneralDocument = gql`
    query general($relativePath: String!) {
  general(relativePath: $relativePath) {
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
    ...GeneralParts
  }
}
    ${GeneralPartsFragmentDoc}`;
export const GeneralConnectionDocument = gql`
    query generalConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: GeneralFilter) {
  generalConnection(
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
        ...GeneralParts
      }
    }
  }
}
    ${GeneralPartsFragmentDoc}`;
export const ActsDocument = gql`
    query acts($relativePath: String!) {
  acts(relativePath: $relativePath) {
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
    ...ActsParts
  }
}
    ${ActsPartsFragmentDoc}`;
export const ActsConnectionDocument = gql`
    query actsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ActsFilter) {
  actsConnection(
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
        ...ActsParts
      }
    }
  }
}
    ${ActsPartsFragmentDoc}`;
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
export function getSdk(requester) {
  return {
    general(variables, options) {
      return requester(GeneralDocument, variables, options);
    },
    generalConnection(variables, options) {
      return requester(GeneralConnectionDocument, variables, options);
    },
    acts(variables, options) {
      return requester(ActsDocument, variables, options);
    },
    actsConnection(variables, options) {
      return requester(ActsConnectionDocument, variables, options);
    },
    journal(variables, options) {
      return requester(JournalDocument, variables, options);
    },
    journalConnection(variables, options) {
      return requester(JournalConnectionDocument, variables, options);
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
      url: "https://content.tinajs.io/3.0/content/f025514a-f4b6-489a-89d2-906074df8f69/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
