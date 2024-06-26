// import { Link, useSearchParams } from 'react-router-dom';
// import { useCallback, useEffect, useState } from 'react';
// import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite';

// import AsideFilter from './Filter/AsideFilter';
// import { Button } from '@/components/ui/button';
// import { CLIENT_ROUTES } from '@/constants/routes';
// import DrawerFilter from './Filter/DrawerFilter';
// import { QUERY_FIELDS } from '@/constants/search';
// import ResultCard from './ResultCard/ResultCard';
// import { getSearchRequestObj } from '@/utils/axiosReqObjects';
// import { IFilterInputs, ISearchData } from '@/types/search.ts';
// import { useSearch } from '@/hooks/useSearch';
// import { Input } from '@nextui-org/react';
import SearchBar from '@/components/SearchBar/SearchBar';
import { SearchFilterSheet } from '@/components/SearchFilterSheet/SearchFilterSheet';

export default function Search() {
  // const searchResults = response ? [...response] : [];
  // const reducedSearchResults = searchResults
  //   .map(({ data }) => data)
  //   .map(({ data }) => data);

  // const data: ISearchData[] = reducedSearchResults
  //   ? [].concat(...reducedSearchResults)
  //   : [];

  return (
    <div className="max-w-[1250px] bg-white mx-auto p-4 min-h-[400px]">
      <SearchBar className="max-w-[500px] mx-auto" />
      <SearchFilterSheet />
      {/* {isLoading && <p>Loading...</p>}
        {data?.map(({ _id, institutionName, semester, subjectCode, year }) => (
          <Link to={`${CLIENT_ROUTES.FILE_PREVIEW}/${_id}`} key={_id}>
            <ResultCard
              id={_id}
              instituteName={institutionName}
              semester={semester}
              subjectCode={subjectCode}
              year={year}
            />
          </Link>
        ))}
        <Button
          onClick={() => {
            setSize((prev) => prev + 1);
          }}
        >
          Load More
        </Button> */}
    </div>
  );
}
