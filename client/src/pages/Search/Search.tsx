/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-underscore-dangle */
import { Image } from '@nextui-org/react';
import SearchBar from '@/components/SearchBar/SearchBar';
import { SearchFilterSheet } from '@/components/SearchFilterSheet/SearchFilterSheet';
import { useSearch } from '@/hooks/useSearch';
import { ISearchData } from '@/types/search';
import ResultCard from './ResultCard/ResultCard';

export default function Search() {
  const {
    swrResponse: { data: response },
    searchInputs,
  } = useSearch();
  const searchResults = response ? [...response] : [];
  const reducedSearchResults = searchResults
    .map(({ data }) => data)
    .map(({ data }) => data);

  const data: ISearchData[] = reducedSearchResults
    ? [].concat(...reducedSearchResults)
    : [];

  return (
    <div className="width-screen bg-white mx-auto p-4">
      <div className="flex flex-row justify-center gap-x-2">
        <SearchBar className="max-w-[500px] focus:border-blue-500" />
        <SearchFilterSheet />
      </div>
      <div className="flex flex-row gap-x-8 justify-center mt-8 ml-20">
        {searchInputs.searchParams === '' && (
          <div className="flex flex-col gap-y-3 font-natosans text-lg justify-center items-center">
            <Image
              width={400}
              height={300}
              src="https://res.cloudinary.com/dzorpsnmn/image/upload/v1719864150/EXAM-ARCHIVE-ASSETS/w294za0tvklwsrustgwn.jpg"
              fallbackSrc="https://via.placeholder.com/300x200"
              alt="Search"
            />
            <p className="text-slate-800">
              Enter comma seperated tags to see relevant results here
            </p>
            <p className="text-slate-500">For example : paging, segmentation</p>
          </div>
        )}
        {searchInputs.searchParams && data.length === 0 && (
          <div className="flex flex-col gap-y-3 font-natosans text-lg justify-center items-center">
            <Image
              width={400}
              height={300}
              src="https://res.cloudinary.com/dzorpsnmn/image/upload/v1719865549/EXAM-ARCHIVE-ASSETS/fdixjd7edbsqna7jow4c.jpg"
              fallbackSrc="https://via.placeholder.com/300x200"
              alt="Not found"
            />
            <p className="text-slate-800">
              Couldn't find any results with the specified tag(s)
            </p>
            <p className="text-slate-500">
              Try searching for something else, or try with a different spelling
            </p>
          </div>
        )}
        {data.map((searchData) => (
          <ResultCard data={searchData} key={searchData._id} />
        ))}
      </div>
    </div>
  );
}
