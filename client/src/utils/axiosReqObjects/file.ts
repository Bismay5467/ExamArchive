/* eslint-disable indent */
import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';
import { IEditTags, IRating } from '@/types/file';

export const getFileObj = (paperId: string) => {
  const url = `${SERVER_ROUTES.FILE}/get/${paperId}`;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    method: 'GET',
    withCredentials: true,
  };

  return axiosObj;
};

export const deleteFileObj = (postId: string, jwtToken: string | undefined) => {
  const url = `${SERVER_ROUTES.FILE}/delete`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: { postId } },
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const updateRatingObj = (
  ratingData: IRating,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.FILE}/rating`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: ratingData },
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const editTagsObj = (
  tagData: IEditTags,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.FILE}/editTags`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: tagData },
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const getUpdateViewCountObj = ({
  postId,
  jwtToken,
}: {
  postId: string;
  jwtToken?: string;
}) => {
  const url = `${SERVER_ROUTES.FILE}/viewCount`;
  const axiosObj: AxiosRequestConfig<any> = jwtToken
    ? {
        url,
        data: { data: postId },
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        withCredentials: true,
      }
    : {
        url,
        data: { data: postId },
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      };

  return axiosObj;
};

export const getUpdateDownloadCountObj = ({
  postId,
  jwtToken,
}: {
  postId: string;
  jwtToken?: string;
}) => {
  const url = `${SERVER_ROUTES.FILE}/downloadCount`;
  const axiosObj: AxiosRequestConfig<any> = jwtToken
    ? {
        url,
        data: { data: postId },
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        withCredentials: true,
      }
    : {
        url,
        data: { data: postId },
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      };

  return axiosObj;
};
