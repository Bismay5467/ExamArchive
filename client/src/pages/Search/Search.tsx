import ResultCard from './ResultCard/ResultCard';
import {} from '@/components/ui/drawer';
import DrawerFilter from './Filter/DrawerFilter';
import AsideFilter from './Filter/AsideFilter';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function Search() {
  const [searchParams, _] = useSearchParams({});
  useEffect(() => {
    console.log(searchParams);
  }, [searchParams]);
  return (
    <div className="max-w-[1280px] mx-auto min-h-[400px] sm:grid sm:grid-cols-10 sm:gap-x-4">
      <div className="flex flex-row justify-around sm:hidden">
        <DrawerFilter />
      </div>
      <AsideFilter />
      <div className="p-4 sm:col-span-7">
        {/* Only for testing */}
        <div className="min-h-[50px] mb-4 p-4 border text-center">
          <p className="font-bold">Showing search results for: </p>
          <p>Query: {searchParams.get('query')}</p>
          <p>Filter1: {searchParams.get('filter1')}</p>
          <p>Filter2: {searchParams.get('filter2')}</p>
          <p>Filter3: {searchParams.get('filter3')}</p>
        </div>
        <ResultCard />
      </div>
    </div>
  );
}
