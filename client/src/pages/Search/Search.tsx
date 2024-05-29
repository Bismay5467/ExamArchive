import ResultCard from './ResultCard/ResultCard';
import DrawerFilter from './Filter/DrawerFilter';
import AsideFilter from './Filter/AsideFilter';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { ISearchData } from '@/types/search.ts';
import { AxiosRequestConfig } from 'axios';
import { toPreviewPage } from '@/constants/routes';
import { IFilterInputs } from '@/types/search.ts';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<IFilterInputs>({});
  const isFirstRender = useRef(false);

  const getRequestObj = (page: number) => {
    const params = {} as Record<string, string | string[]>;

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

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // TODO: Content of previousPageData needs further testing

    if (previousPageData && !previousPageData.hasMore) return null;
    return getRequestObj(pageIndex + 1);
  };

  const { data: response, setSize } = useSWRInfinite(getKey, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!isFirstRender.current) {
      const filterValues: IFilterInputs = {};
      searchParams.forEach((value, key) => {
        if (key === 'query') return;
        if (searchParams.has(key))
          filterValues[key as keyof IFilterInputs] = value;
      });
      isFirstRender.current = true;
      setFilters(filterValues);
    } else {
      isFirstRender.current = true;
      const newSearchParams = new URLSearchParams();
      newSearchParams.set('query', searchParams.get('query') || '');
      Object.entries(filters).forEach(([key, value]) => {
        if (value === '') return;
        newSearchParams.set(key, value);
      });

      setSearchParams(newSearchParams);
    }
  }, [filters]);

  const searchResults = response ? [].concat(...response) : [];
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
          setFilters={setFilters}
        />
      </div>
      <AsideFilter
        key={Math.random()}
        filters={filters}
        setFilters={setFilters}
      />
      <div className="p-4 flex flex-col gap-y-4 sm:col-span-7">
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
