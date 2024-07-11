import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';
import { TFileUploadFormFields } from '@/types/upload';

export const getUploadStatsObj = (jwtToken: string | undefined) => {
  const url = `${SERVER_ROUTES.UPLOAD}/getStats`;
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

export const fileUploadObj = (
  fileUploadData: TFileUploadFormFields[],
  jwtToken: string | undefined
) => {
  const url = SERVER_ROUTES.UPLOAD;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: fileUploadData },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
