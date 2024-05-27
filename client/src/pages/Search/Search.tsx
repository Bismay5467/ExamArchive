import ResultCard from './ResultCard/ResultCard';
import DrawerFilter from './Filter/DrawerFilter';
import AsideFilter from './Filter/AsideFilter';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';
import { SearchResponse } from '@/types/api-types';
import { axiosInstance } from '@/utils/swr/fetcher';

export default function Search() {
  const [searchParams, _] = useSearchParams();

  const fetcher = (url: string) => {
    const entries = {} as Record<string, string | string[]>;
    searchParams.forEach((value, key) => {
      if (key === 'year') {
        entries[key] = value.split(',').map((item) => item.trim());
      } else if (key === 'query') {
        entries['searchParams'] = value.split(',').map((item) => item.trim());
      } else if (key) entries[key] = value;
    });

    return axiosInstance({ url: url, params: entries, method: 'GET' });
  };

  const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    // TODO: Content of previousPageData needs further testing

    if (previousPageData && !previousPageData.hasMore) return null;
    return `/search?page=${pageIndex + 1}`;
  };

  const { data, setSize, mutate } = useSWRInfinite(getKey, fetcher);

  useEffect(() => {
    mutate();
  }, [searchParams]);

  return (
    <div className="max-w-[1280px] mx-auto min-h-[400px] sm:grid sm:grid-cols-10 sm:gap-x-4">
      <div className="flex flex-row justify-around sm:hidden">
        <DrawerFilter />
      </div>
      <AsideFilter />
      <div className="p-4 flex flex-col gap-y-4 sm:col-span-7">
        {data?.map((value) => {
          const data: SearchResponse = value.data;
          return data?.data.map((res) => {
            return (
              <Link to={`/preview/${res._id}`} target="_blank" key={res._id}>
                <ResultCard
                  id={res._id}
                  instituteName={res.institutionName}
                  semester={res.semester}
                  subjectCode={res.semester}
                  year={res.year}
                />
              </Link>
            );
          });
        })}
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
