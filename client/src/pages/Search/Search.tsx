/* eslint-disable no-underscore-dangle */
import ResultCard from './ResultCard/ResultCard';
import DrawerFilter from './Filter/DrawerFilter';
import AsideFilter from './Filter/AsideFilter';
import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { ISearchData } from '@/types/search.ts';
import { toPreviewPage } from '@/constants/routes';
import { IFilterInputs } from '@/types/search.ts';
import { getSearchRequestObj } from '@/utils/axiosReqObjects';
import fetcher from '@/utils/fetcher/fetcher';

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
  } = useSWRInfinite(getKey, fetcher);

  const handleFilterSubmit = useCallback(
    (newFilters: IFilterInputs) => {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('query', searchParams.get('query') || '');
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
      if (key === 'query') return;
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
