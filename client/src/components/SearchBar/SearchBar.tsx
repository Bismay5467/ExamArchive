import { Input } from '@nextui-org/react';
// import debounce from 'lodash.debounce';
import { IoIosSearch } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useSearch } from '@/hooks/useSearch';

export default function SearchBar({ className }: { className?: string }) {
  const { setSearchParam, searchInputs } = useSearch();
  const [searchField, setSearchField] = useState<string>('');

  // const DELAY_IN_MS = 500;
  // const debouncedSearch = (query: string) => {
  //   setSearchParam(query);
  // };
  const handleSearch = (query: string) => {
    setSearchField(query);
    setSearchParam(query);
  };
  useEffect(() => {
    if (searchInputs.searchParams) setSearchField(searchInputs.searchParams);
  }, [searchInputs.searchParams]);

  return (
    <Input
      value={searchField}
      size="md"
      radius="sm"
      className={className}
      placeholder="Enter comma separated values"
      onValueChange={handleSearch}
      startContent={<IoIosSearch className="text-xl font-bold" />}
    />
  );
}
