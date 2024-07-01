import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';
import { IModerator, TModeratorRole } from '@/types/superadmin';

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
  moderator: IModerator,
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
