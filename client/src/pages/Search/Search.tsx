/* eslint-disable no-underscore-dangle */
import SearchBar from '@/components/SearchBar/SearchBar';
import { SearchFilterSheet } from '@/components/SearchFilterSheet/SearchFilterSheet';
import { useSearch } from '@/hooks/useSearch';
import { ISearchData } from '@/types/search';
import ResultCard from './ResultCard/ResultCard';
import { ResultCardShimmer } from './Shimmer/Shimmer';
import InitialDisplay from './Placeholders/InitialDisplay';
import NoResults from './Placeholders/NoResults';

export default function Search() {
  const {
    swrResponse: { data: response, isLoading },
    searchInputs,
    isEmptySearch,
  } = useSearch();
  const searchResults = response ? [...response] : [];
  const reducedSearchResults = searchResults
    .map(({ data }) => data)
    .map(({ data }) => data);

  const data: ISearchData[] = reducedSearchResults
    ? [].concat(...reducedSearchResults)
    : [];

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <div className="flex flex-row justify-center gap-x-2">
        <SearchBar className="max-w-[500px] focus:border-blue-500" />
        <SearchFilterSheet />
      </div>
      <div className="flex flex-col gap-y-8 justify-center mt-8 sm:px-24">
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <ResultCardShimmer key={index} />
            ))}
          </>
        ) : (
          <>
            {isEmptySearch && <InitialDisplay />}
            {searchInputs.searchParams && data.length === 0 && <NoResults />}
            {data.map((searchData) => (
              <ResultCard data={searchData} key={searchData._id} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
