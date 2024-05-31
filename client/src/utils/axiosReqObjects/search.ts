import { AxiosRequestConfig } from 'axios';
import { useSearchParams } from 'react-router-dom';

export const getSearchRequestObj = (page: number) => {
  const params = {} as Record<string, string | string[]>;
  const [searchParams, _] = useSearchParams();

  searchParams.forEach((value, key) => {
    if (key === 'year') {
      const currentYear = new Date().getFullYear();
      const last = Number(value.split(' ').at(1));
      let years: string[] = [];
      for (let i = 0; i < last; i++) years.push(String(currentYear - i));
      params[key] = years;
    } else if (key === 'query') {
      if (value.length === 0) {
        // TODO: Show a toast ('Search field can't be empty!)
        return null;
      }
      params['searchParams'] = value.split(',').map((item) => item.trim());
    } else if (key) params[key] = value;
  });

  params['page'] = String(page);

  const requestObj: AxiosRequestConfig<any> = {
    url: '/search?',
    params,
    method: 'GET',
  };

  return requestObj;
};
