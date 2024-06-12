import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';
import { ICreateFolder, IFolder } from '@/types/folder';

export const getFolderNameObj = (
  action: IFolder,
  jwtToken: string | undefined
) => {
  const params = { action };
  const url = `${SERVER_ROUTES.FOLDER}/getFolderNames`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    method: 'GET',
    params,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const createFolderObj = (
  folderDetails: ICreateFolder,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.FOLDER}/create`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: folderDetails },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
