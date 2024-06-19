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
  page: string;
  parentId: string;
}

export interface IBookmarkFolder {
  _id: string;
  name: string;
  noOfFiles: number;
  createdAt: string;
  updatedAt: string;
}
