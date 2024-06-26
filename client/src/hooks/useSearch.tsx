/* eslint-disable no-console */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IFilterInputs, ISearchContext, ISearchInputs } from '@/types/search';

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

  const setSearchParam = (query: string) => {
    console.log(searchInputs);
    const currentParams: ISearchInputs = {
      ...Object.fromEntries(
        Object.entries(searchInputs).filter(([_, value]) => value !== undefined)
      ),
      searchParams: query,
    };

    setURLSearchParams({ ...currentParams, searchParams: query });
  };

  const setFilters = (filters: IFilterInputs) => {
    setURLSearchParams({
      ...Object.fromEntries(
        Object.entries(searchInputs).filter(([_, value]) => value !== undefined)
      ),
      ...filters,
    });
  };

  useEffect(() => {
    if (searchInputs.searchParams) setSearchParam(searchInputs.searchParams);
    const { subjectName, year, sortFilter, examType } = searchInputs;
    const filter = {
      ...(subjectName && { subjectName }),
      ...(year && { year }),
      ...(sortFilter && { sortFilter }),
      ...(examType && { examType }),
    };
    if (typeof filter === 'object' && Object.keys(filter).length > 0) {
      setFilters(filter);
    }
  }, [JSON.stringify(searchInputs)]);

  useEffect(() => {
    const currentSearchInputs: ISearchInputs = { searchParams: '' };
    urlSearchParams.forEach((value, key) => {
      currentSearchInputs[key as keyof ISearchInputs] = value;
    });

    console.log(currentSearchInputs);

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
