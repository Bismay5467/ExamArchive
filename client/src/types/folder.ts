export type TAction = 'UPLOAD' | 'BOOKMARK';

export interface ICreateFolder {
  action: TAction;
  folderName: string;
}

export interface IDeleteFolder {
  action: TAction;
  folderId: string;
}

// Folder is also a file (parentId = "")
export interface IGetFilesData {
  action: TAction;
  parentId: string;
}

export interface IFolder {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  noOfFiles?: number;
}

export type TFileType<T extends TAction> = {
  type: T;
  fileId: string;
  questionId: string;
  filename: string;
  createdAt: string;
  updatedAt: string;
} & (T extends 'UPLOAD'
  ? { status: string }
  : T extends 'BOOKMARK'
    ? { isPinned: boolean }
    : {});

export interface IPinnedFile {
  name: string;
  questionId: string;
  updatedAt: string;
  fileId: string;
}
