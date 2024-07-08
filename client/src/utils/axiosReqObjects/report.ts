import { AxiosRequestConfig } from 'axios';
import { IReportContent, IResolveReport } from '@/types/report';
import { SERVER_ROUTES } from '@/constants/routes';
import { IReportFilterFields } from '@/types/superadmin';

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

export const viewReportsObj = (
  viewReportData: IReportFilterFields,
  page: string,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.REPORT}/view`;
  const sanitizedParams = {
    ...viewReportData,
    ...(viewReportData.contentType && {
      contentType: viewReportData.contentType,
    }),
    ...(viewReportData.countOfReports && {
      countOfReports: viewReportData.countOfReports,
    }),
    ...(viewReportData.sortFilters && {
      sortFilters: viewReportData.sortFilters,
    }),
    page,
  };

  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    params: sanitizedParams,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
