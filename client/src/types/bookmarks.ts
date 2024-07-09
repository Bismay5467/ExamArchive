import { KeyedMutator } from 'swr';
import { IPinnedFile } from './folder';

export interface IAddToBookmarks {
  folderId: string;
  fileId: string;
  fileName: string;
}

export interface IRemoveBookmarks {
  folderId: string;
  fileId: string;
}

export interface IPinContext {
  pinnedFiles: Array<IPinnedFile>;
  mutate: KeyedMutator<any>;
}
