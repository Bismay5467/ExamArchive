/* eslint-disable require-await */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSWRInfinite, {
  SWRInfiniteKeyLoader,
  SWRInfiniteResponse,
} from 'swr/infinite';
import { debounce } from 'lodash';
import { IFilterInputs, ISearchContext, ISearchInputs } from '@/types/search';
import { getSearchRequestObj } from '@/utils/axiosReqObjects';

const DEBOUNCE_DELAY_IN_MS = 500;

const defaultSWRResponseState: SWRInfiniteResponse<any, any> = {
  data: [],
  error: null,
  isLoading: false,
  isValidating: false,
  mutate: async () => [],
  setSize: async () => [],
  size: 0,
};

const SearchContext = createContext<ISearchContext>({
  searchInputs: { searchParams: '' },
  swrResponse: defaultSWRResponseState,
  setFilters: (_filters) => {},
  setSearchParam: (_query: string) => {},
  clearFilters: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [urlSearchParams, setURLSearchParams] = useSearchParams();
  const [searchInputs, setSearchInputs] = useState<ISearchInputs>({
    searchParams: '',
  });

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // TODO: Content of previousPageData needs further testing

    if (previousPageData && !previousPageData.data.hasMore) return null;
    if (searchInputs.searchParams.length === 0) return null;
    return getSearchRequestObj(searchInputs, pageIndex + 1);
  };
  const swrResponse = useSWRInfinite(getKey);

  const setSearchParam = debounce((query: string) => {
    const currentParams: ISearchInputs = {
      ...Object.fromEntries(
        Object.entries(searchInputs).filter(([_, value]) => value)
      ),
      searchParams: query,
    };
    setURLSearchParams({ ...currentParams });
  }, DEBOUNCE_DELAY_IN_MS);

  const setFilters = (filters: IFilterInputs) => {
    const currentParams: ISearchInputs = {
      searchParams: searchInputs.searchParams,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      ),
    };
    setURLSearchParams({ ...currentParams });
  };

  const clearFilters = () => {
    const currentParams: ISearchInputs = {
      searchParams: searchInputs.searchParams,
    };
    setURLSearchParams({ ...currentParams });
  };

  useEffect(() => {
    const currentSearchInputs = { searchParams: '' } as any;
    urlSearchParams.forEach((value: any, key: any) => {
      currentSearchInputs[key] = value;
    });
    setSearchInputs(currentSearchInputs);
  }, [urlSearchParams]);

  return (
    <SearchContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        searchInputs,
        setFilters,
        setSearchParam,
        swrResponse,
        clearFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }

  return context;
};
