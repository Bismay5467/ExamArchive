import ResultCard from './ResultCard/ResultCard';
import {} from '@/components/ui/drawer';
import DrawerFilter from './Filter/DrawerFilter';
import AsideFilter from './Filter/AsideFilter';
import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useSearch } from '@/hooks/swr-hooks/useSearch';
import { Button } from '@/components/ui/button';

export default function Search() {
  const [page, setPage] = useState<number>(1);
  const [searchParams, _] = useSearchParams();

  const getParamsPayload = () => {
    const entries = {} as Record<string, string | string[]>;
    searchParams.forEach((value, key) => {
      if (key === 'year') {
        entries[key] = value.split(',').map((item) => item.trim());
      } else if (key === 'query') {
        entries['searchParams'] = value.split(',').map((item) => item.trim());
      } else if (key) entries[key] = value;
    });

    entries['page'] = String(page);

    return entries;
  };

  const { data } = useSearch(getParamsPayload());

  return (
    <div className="max-w-[1280px] mx-auto min-h-[400px] sm:grid sm:grid-cols-10 sm:gap-x-4">
      <div className="flex flex-row justify-around sm:hidden">
        <DrawerFilter />
      </div>
      <AsideFilter />
      <div className="p-4 flex flex-col gap-y-4 sm:col-span-7">
        {data?.data.map((res) => (
          <Link to={`/preview/${res._id}`} target="_blank" key={res._id}>
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
            data?.hasMore && setPage((prev) => prev + 1);
          }}
        >
          Load More
        </Button>
      </div>
    </div>
  );
}
