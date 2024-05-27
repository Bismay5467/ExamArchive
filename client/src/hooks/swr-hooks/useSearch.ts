import { SearchResponse } from '@/types/api-types';
import { axiosInstance } from '@/utils/swr/fetcher';
import useSWR from 'swr';

export const useSearch = (params: Record<string, string | string[]>) => {
  console.log(params);

  console.log(params);
  const fetcher = (url: string) =>
    axiosInstance({ url, params: params, method: 'GET' }).then(
      (res) => res.data
    );

  return useSWR<SearchResponse>(['/search', params], ([url]) => fetcher(url));
};
