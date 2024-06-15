import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';
import {
  IDeleteComment,
  IGetComments,
  IPostComment,
  IEditComment,
} from '@/types/comments';

export const getCommentsObj = (
  { postId, page, parentId, commentType }: IGetComments,
  jwtToken: string | undefined
) => {
  const params = { postId, page, commentType, ...(parentId && { parentId }) };
  if (!jwtToken) return null;
  const requestObj: AxiosRequestConfig<any> = {
    url: `${SERVER_ROUTES.COMMENT}/get`,
    params,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    method: 'GET',
  };

  return requestObj;
};

export const postCommentObj = (
  commentData: IPostComment,
  jwtToken: string | undefined
) => {
  if (!jwtToken) return null;

  const axiosObj: AxiosRequestConfig<any> = {
    url: `${SERVER_ROUTES.COMMENT}/post`,
    data: { data: commentData },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const editCommentObj = (
  commentData: IEditComment,
  jwtToken: string | undefined
) => {
  if (!jwtToken) return null;

  const axiosObj: AxiosRequestConfig<any> = {
    url: `${SERVER_ROUTES.COMMENT}/edit`,
    data: { data: commentData },
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const deleteCommentObj = (
  commentData: IDeleteComment,
  jwtToken: string | undefined
) => {
  if (!jwtToken) return null;

  const axiosObj: AxiosRequestConfig<any> = {
    url: `${SERVER_ROUTES.COMMENT}/delete`,
    data: { data: commentData },
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
