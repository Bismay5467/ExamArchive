import { AxiosRequestConfig } from 'axios';
import { IReportContent, IResolveReport } from '@/types/report';
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

export const resolveReportObj = (
  reportData: IResolveReport,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.REPORT}/markResolved`;
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

export const viewReportsObj = (page: string, jwtToken: string | undefined) => {
  const url = `${SERVER_ROUTES.REPORT}/view`;

  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    params: { page },
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
