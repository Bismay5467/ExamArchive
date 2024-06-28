/* eslint-disable function-paren-newline */

import { AxiosRequestConfig } from 'axios';
import { SERVER_ROUTES } from '@/constants/routes';
import { ISearchInputs } from '@/types/search';
import { getPreviousYears } from '../helpers';

export default (searchInputs: ISearchInputs, page: number) => {
  const sanitizedParams = {
    ...searchInputs,
    ...(searchInputs.searchParams && {
      searchParams: searchInputs.searchParams
        .split(',')
        .map((item: any) => item.trim()),
    }),
    ...(searchInputs.year && { year: getPreviousYears(searchInputs.year) }),
    page: page.toString(),
  };

  const requestObj: AxiosRequestConfig<any> = {
    url: SERVER_ROUTES.SEARCH,
    params: sanitizedParams,
    method: 'GET',
  };

  return requestObj;
};
