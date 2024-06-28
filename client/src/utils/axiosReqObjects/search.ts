/* eslint-disable function-paren-newline */

import { AxiosRequestConfig } from 'axios';

import { QUERY_FIELDS } from '@/constants/search';
import { SERVER_ROUTES } from '@/constants/routes';
import { ISearchInputs } from '@/types/search';

export default ({
  page,
  searchInputs,
}: {
  page: number;
  searchInputs: ISearchInputs;
}) => {
  const params = {} as Record<string, string | string[]>;

  Object.entries(searchInputs).forEach(([key, value]) => {
    if (key === QUERY_FIELDS.YEAR) {
      const currentYear = new Date().getFullYear();
      const last = parseInt(value, 10);
      const years = Array.from({ length: last }, (_, i) =>
        (currentYear - i).toString()
      );
      params[key] = years;
    } else if (key === QUERY_FIELDS.QUERY_PARAMS) {
      params.searchParams = value.split(',').map((item: any) => item.trim());
    } else if (key) params[key] = value;
  });

  params.page = page.toString();

  const requestObj: AxiosRequestConfig<any> = {
    url: SERVER_ROUTES.SEARCH,
    params,
    method: 'GET',
  };
  // eslint-disable-next-line no-console
  console.log(requestObj);

  return requestObj;
};
