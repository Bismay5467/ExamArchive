export type IAction = 'UPLOAD' | 'BOOKMARK';

export interface ICreateFolder {
  action: IAction;
  folderName: string;
}

export interface IDeleteFolder {
  action: IAction;
  folderId: string;
}

// Folder is also a file (parentId = "")
export interface IGetFilesData {
  action: IAction;
  parentId: string;
}

export interface IBookmarkFolder {
  _id: string;
  name: string;
  noOfFiles: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBookmarkFile {
  fileId: string;
  questionId: string;
  filename: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}

export interface IPinnedFile {
  name: string;
  questionId: string;
  updatedAt: string;
}
