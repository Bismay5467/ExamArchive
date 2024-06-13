import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';
import { IAddToBookmarks, IRemoveBookmarks } from '@/types/bookmarks';

export const addToBookmarkObj = (
  bookmarkData: IAddToBookmarks,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.BOOKMARK}/add`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: bookmarkData },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const removeBookmarkObj = (
  bookmarkData: IRemoveBookmarks,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.BOOKMARK}/remove`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: bookmarkData },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
