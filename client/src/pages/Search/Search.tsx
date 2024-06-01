/* eslint-disable no-underscore-dangle */
import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';

import AsideFilter from './Filter/AsideFilter';
import { Button } from '@/components/ui/button';
import DrawerFilter from './Filter/DrawerFilter';
import { IFilterInputs } from '@/types/search.ts';
import { ISearchData } from '@/types/search.ts';
import { QUERY_FIELDS } from '@/constants/search';
import ResultCard from './ResultCard/ResultCard';
import { getSearchRequestObj } from '@/utils/axiosReqObjects';
import { toPreviewPage } from '@/constants/routes';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<IFilterInputs>({});

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // TODO: Content of previousPageData needs further testing

    if (previousPageData && !previousPageData.hasMore) return null;
    return getSearchRequestObj({ page: pageIndex + 1, searchParams });
  };

  const {
    data: response,
    setSize,
    isLoading,
  } = useSWRInfinite(getKey, { revalidateOnFocus: false });

  const handleFilterSubmit = useCallback(
    (newFilters: IFilterInputs) => {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set(
        QUERY_FIELDS.QUERY,
        searchParams.get(QUERY_FIELDS.QUERY) || ''
      );
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === '') return;
        newSearchParams.set(key, value);
      });

      setSearchParams(newSearchParams);
    },
    [filters]
  );

  useEffect(() => {
    const filterValues: IFilterInputs = {};
    searchParams.forEach((value, key) => {
      if (key === QUERY_FIELDS.QUERY) return;
      filterValues[key as keyof IFilterInputs] = value;
    });
    setFilters(filterValues);
  }, []);

  const searchResults = response ? [...response] : [];
  const reducedSearchResults = searchResults
    .map(({ data }) => data)
    .map(({ data }) => data);

  const data: ISearchData[] = reducedSearchResults
    ? [].concat(...reducedSearchResults)
    : [];

  return (
    <div className="max-w-[1280px] mx-auto min-h-[400px] sm:grid sm:grid-cols-10 sm:gap-x-4">
      <div className="flex flex-row justify-around sm:hidden">
        <DrawerFilter
          key={Math.random()}
          filters={filters}
          handleFilterSubmit={handleFilterSubmit}
        />
      </div>
      <AsideFilter
        key={Math.random()}
        filters={filters}
        handleFilterSubmit={handleFilterSubmit}
      />
      <div className="p-4 flex flex-col gap-y-4 sm:col-span-7">
        {isLoading && <p>Loading...</p>}
        {data?.map((res) => (
          <Link to={toPreviewPage(res._id)} target="_blank" key={res._id}>
            <ResultCard
              id={res._id}
              instituteName={res.institutionName}
              semester={res.semester}
              subjectCode={res.semester}
              year={res.year}
            />
          </Link>
        ))}
        <Button
          onClick={() => {
            setSize((prev) => prev + 1);
          }}
        >
          Load More
        </Button>
      </div>
    </div>
  );
}
