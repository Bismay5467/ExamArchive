import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';
import { IModerator, TModeratorRole } from '@/types/moderator';

export const getModeratorsObj = (
  { role }: { role: TModeratorRole },
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.SUPER_ADMIN}/get`;

  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    params: { role },
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const removeModeratorObj = (
  moderator: Partial<IModerator>,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.SUPER_ADMIN}/remove`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: moderator },
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const addModeratorObj = (
  moderator: IModerator,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.SUPER_ADMIN}/add`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: moderator },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const getInstitueNamesObj = (jwtToken: string | undefined) => {
  const url = `${SERVER_ROUTES.SUPER_ADMIN}/getInsituteName`;

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

export const addInstitueNamesObj = (
  instituteName: string,
  jwtToken: string | undefined
) => {
  const url = `${SERVER_ROUTES.SUPER_ADMIN}/addInsitituteName`;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: { instituteName } },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};

export const updateModeratorCache = () => {
  const url = `${SERVER_ROUTES.SUPER_ADMIN}/update`;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: {} },
    method: 'PUT',
    withCredentials: true,
  };

  return axiosObj;
};
