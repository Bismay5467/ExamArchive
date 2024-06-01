/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import { SERVER_ROUTES } from '@/constants/route';
import { QUERY_FIELDS } from '@/constants/search';
import { AxiosRequestConfig } from 'axios';
import { useSearchParams } from 'react-router-dom';

export default ({
  page,
  searchParams,
}: {
  page: number;
  searchParams: URLSearchParams;
}) => {
  const params = {} as Record<string, string | string[]>;

  searchParams.forEach((value, key) => {
    if (key === QUERY_FIELDS.YEAR) {
      const currentYear = new Date().getFullYear();
      const last = parseInt(value.split(' ')[1], 10);
      const years = Array.from({ length: last }, (_, i) =>
        (currentYear - i).toString()
      );
      params[key] = years;
    } else if (key === QUERY_FIELDS.QUERY) {
      if (value.length === 0) {
        // TODO: Show a toast ('Search field can't be empty!)
        return null;
      }
      params.searchParams = value.split(',').map((item) => item.trim());
    } else if (key) params[key] = value;
  });

  params.page = String(page);

  const requestObj: AxiosRequestConfig<any> = {
    url: SERVER_ROUTES.SEARCH,
    params,
    method: 'GET',
  };

  return requestObj;
};
