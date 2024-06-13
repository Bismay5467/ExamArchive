import { AxiosRequestConfig } from 'axios';
import { IRating } from '@/types/ratiing';
import { SERVER_ROUTES } from '@/constants/routes';

export const updateRatingObj = (
  ratingData: IRating,
  jwtToken: string | undefined
) => {
  const url = SERVER_ROUTES.RATING;
  if (!jwtToken) return null;
  const axiosObj: AxiosRequestConfig<any> = {
    url,
    data: { data: ratingData },
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
