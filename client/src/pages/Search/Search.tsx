import ResultCard from './ResultCard/ResultCard';
import DrawerFilter from './Filter/DrawerFilter';
import AsideFilter from './Filter/AsideFilter';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { SearchData } from '@/types/api-types';
import { AxiosRequestConfig } from 'axios';
import { toPreview } from '@/constants/routes';

export default function Search() {
  const [searchParams, _] = useSearchParams();

  const getRequestObj = (page: number) => {
    const params = {} as Record<string, string | string[]>;
    searchParams.forEach((value, key) => {
      if (key === 'year') {
        params[key] = value.split(',').map((item) => item.trim());
      } else if (key === 'query') {
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

  const {
    data: response,
    setSize,
    mutate,
  } = useSWRInfinite(getKey, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    mutate();
  }, [searchParams]);

  const searchResults = response ? [].concat(...response) : [];
  const reducedSearchResults = searchResults
    .map(({ data }) => data)
    .map(({ data }) => data);

  const data: SearchData[] = reducedSearchResults
    ? [].concat(...reducedSearchResults)
    : [];

  return (
    <div className="max-w-[1280px] mx-auto min-h-[400px] sm:grid sm:grid-cols-10 sm:gap-x-4">
      <div className="flex flex-row justify-around sm:hidden">
        <DrawerFilter />
      </div>
      <AsideFilter />
      <div className="p-4 flex flex-col gap-y-4 sm:col-span-7">
        {data?.map((res) => (
          <Link to={toPreview(res._id)} target="_blank" key={res._id}>
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
