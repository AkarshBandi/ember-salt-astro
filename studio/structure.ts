import type { StructureBuilder } from 'sanity/structure';

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .schemaType('page')
        .child(S.documentTypeList('page').title('Pages')),
      S.listItem()
        .title('Journal entries')
        .schemaType('journalPost')
        .child(S.documentTypeList('journalPost').title('Journal entries')),
      S.listItem()
        .title('Site settings')
        .child(
          S.document()
            .schemaType('config')
            .documentId('config')
            .title('Site settings'),
        ),
    ]);
