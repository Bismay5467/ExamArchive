export type IFolder = 'UPLOAD' | 'BOOKMARK';

export interface ICreateFolder {
  action: IFolder;
  folderName: string;
}
