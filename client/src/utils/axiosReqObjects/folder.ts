import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';
import {
  ICreateFolder,
  IAction,
  IGetFilesData,
  IDeleteFolder,
} from '@/types/folder';

export const getFolderNameObj = (
  action: IAction,
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

export const getFilesDataObj = (
  fileData: IGetFilesData,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.FOLDER}/get`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    method: 'GET',
    params: fileData,
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

export const deleteFolderObj = (
  folderDetails: IDeleteFolder,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.FOLDER}/delete`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: folderDetails },
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const getPinnedFilesObj = (jwtToken: string | undefined) => {
  const url = `${SERVER_ROUTES.FOLDER}/getPinFiles`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const togglePinObj = (
  fileDetails: { fileId: string; action: 'PIN' | 'UNPIN' },
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.FOLDER}/pinFile`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: fileDetails },
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
