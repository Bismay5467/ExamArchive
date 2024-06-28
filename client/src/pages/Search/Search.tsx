/* eslint-disable no-underscore-dangle */
import SearchBar from '@/components/SearchBar/SearchBar';
import { SearchFilterSheet } from '@/components/SearchFilterSheet/SearchFilterSheet';
import { useSearch } from '@/hooks/useSearch';
import { ISearchData } from '@/types/search';
import ResultCard from './ResultCard/ResultCard';

export default function Search() {
  const {
    swrResponse: { data: response },
  } = useSearch();
  const searchResults = response ? [...response] : [];
  const reducedSearchResults = searchResults
    .map(({ data }) => data)
    .map(({ data }) => data);

  const data: ISearchData[] = reducedSearchResults
    ? [].concat(...reducedSearchResults)
    : [];

  return (
    <div className="max-w-[1080px] bg-white mx-auto p-4 min-h-[400px]">
      <div className="flex flex-row justify-center gap-x-2">
        <SearchBar className="max-w-[500px]" />
        <SearchFilterSheet />
      </div>
      <div className="flex flex-col gap-y-4 items-center mt-8">
        {data.map((searchData) => (
          <ResultCard data={searchData} key={searchData._id} />
        ))}
      </div>
    </div>
  );
}
