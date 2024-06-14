import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';

export const getFileObj = (paperId: string) => {
  const url = `${SERVER_ROUTES.GETFILE}/${paperId}`;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    method: 'GET',
    withCredentials: true,
  };

  return axiosObj;
};
