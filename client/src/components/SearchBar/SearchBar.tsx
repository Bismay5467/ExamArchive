import { Input } from '@nextui-org/react';
import { IoIosSearch } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useSearch } from '@/hooks/useSearch';

export default function SearchBar({ className }: { className?: string }) {
  const { setSearchParam, searchInputs } = useSearch();
  const [searchField, setSearchField] = useState<string>('');
  const handleSearch = (query: string) => {
    setSearchField(query);
    setSearchParam(query);
  };
  useEffect(() => {
    setSearchField(searchInputs.searchParams);
  }, [searchInputs.searchParams]);

  return (
    <Input
      value={searchField}
      size="md"
      variant="bordered"
      radius="full"
      className={className}
      placeholder="Enter subject name, subject code or comma separated tags"
      onValueChange={handleSearch}
      startContent={<IoIosSearch className="text-xl font-bold" />}
      autoFocus
    />
  );
}
