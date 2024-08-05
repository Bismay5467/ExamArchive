/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { useEffect, useMemo } from 'react';
import { Spinner } from '@nextui-org/react';
import SearchBar from '@/components/SearchBar/SearchBar';
import { SearchFilterSheet } from '@/components/SearchFilterSheet/SearchFilterSheet';
import { useSearch } from '@/hooks/useSearch';
import { ISearchData } from '@/types/search';
import ResultCard from './ResultCard/ResultCard';
import { ResultCardShimmer } from './Shimmer/Shimmer';
import InitialDisplay from './Placeholders/InitialDisplay';
import NoResults from './Placeholders/NoResults';
import CTABanner from '@/components/CTABanner/CTABanner';

export default function Search() {
  const {
    swrResponse: { data: response, isLoading, isValidating, setSize },
    isEmptySearch,
  } = useSearch();
  const searchResults = response ? [...response] : [];
  const reducedSearchResults = searchResults
    .map(({ data }) => data)
    .map(({ data }) => data);

  const data: ISearchData[] = reducedSearchResults
    ? [].concat(...reducedSearchResults)
    : [];
  const hasMore = useMemo(
    () => response?.at(response.length - 1).data.hasMore ?? false,
    [response]
  );
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading ||
      isValidating
    ) {
      return;
    }

    if (hasMore) setSize((prev) => prev + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  return (
    <>
      <CTABanner />
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
              {isEmptySearch ? (
                <InitialDisplay />
              ) : data.length === 0 ? (
                <NoResults />
              ) : (
                data.map((searchData) => (
                  <ResultCard data={searchData} key={searchData._id} />
                ))
              )}
              {isValidating && hasMore && (
                <Spinner size="md" color="secondary" />
              )}
              {!hasMore && data.length !== 0 && (
                <p className="text-slate-400 font-medium cursor-pointer w-fit self-center">
                  End of Results...
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
