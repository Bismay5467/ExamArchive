/* eslint-disable no-console */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { IFilterInputs, ISearchContext, ISearchInputs } from '@/types/search';
import { getSearchRequestObj } from '@/utils/axiosReqObjects';

const defaultState: ISearchInputs = {
  searchParams: '',
};

const SearchContext = createContext<ISearchContext>({
  searchInputs: defaultState,
  setFilters: (_filters) => {},
  setSearchParam: (_query: string) => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [urlSearchParams, setURLSearchParams] = useSearchParams();
  const [searchInputs, setSearchInputs] = useState<ISearchInputs>(defaultState);
  console.log(searchInputs);

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // TODO: Content of previousPageData needs further testing

    if (previousPageData && !previousPageData.data.hasMore) return null;
    if (searchInputs.searchParams.length === 0) return null;
    return getSearchRequestObj({ page: pageIndex + 1, searchInputs });
  };
  const {
    data: response,
    // size,
    // setSize,
    // isLoading,
    // mutate,
    // error,
    // isValidating,
  } = useSWRInfinite(getKey);

  console.log(response);

  const setSearchParam = (query: string) => {
    const currentParams: ISearchInputs = {
      ...Object.fromEntries(
        Object.entries(searchInputs).filter(([_, value]) => value)
      ),
      searchParams: query,
    };
    setURLSearchParams({ ...currentParams });
  };

  const setFilters = (filters: IFilterInputs) => {
    const currentParams: ISearchInputs = {
      ...searchInputs,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      ),
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
      value={{ searchInputs, setFilters, setSearchParam }}
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
