import { SearchResponse } from '@/types/api-types';
import useSWR from 'swr';

export const useSearch = (searchPrams: string, page: number) => {
  const paramsPaload: string = searchPrams.split(' ').join(',');

  return useSWR<SearchResponse>(
    `/search?searchParams=${paramsPaload}&&page=${page}`
  );
};
