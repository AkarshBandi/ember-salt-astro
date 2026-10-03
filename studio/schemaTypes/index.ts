import { page } from './page';
import { journalPost } from './journalPost';
import { config } from './config';
import { blockTypes } from './blocks';

export const schemaTypes = [page, journalPost, config, ...blockTypes];
