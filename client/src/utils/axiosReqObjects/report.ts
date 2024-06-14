import { AxiosRequestConfig } from 'axios';
import { IReportContent } from '@/types/report';
import { SERVER_ROUTES } from '@/constants/routes';

export const reportObj = (
  reportData: IReportContent,
  jwtToken: string | undefined
) => {
  const url = SERVER_ROUTES.REPORT;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: reportData },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
