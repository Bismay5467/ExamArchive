import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';

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
