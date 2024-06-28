import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import { IoFilter } from 'react-icons/io5';
import useSWR from 'swr';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SERVER_ROUTES } from '@/constants/routes';
import { useSearch } from '@/hooks/useSearch';
import { IFilterInputs } from '@/types/search';
import { SEARCH_FILTTER_OPTIONS } from '@/constants/search';
import OptionGroup from './OptionGroup/OptionGroup';

export function SearchFilterSheet() {
  const requestObj: AxiosRequestConfig<any> = {
    url: `${SERVER_ROUTES.SEARCH}/getSubjectFilters`,
    method: 'GET',
  };
  const { setFilters, searchInputs } = useSearch();
  const [filter, setFilter] = useState<IFilterInputs>({
    subjectName: undefined,
    examType: undefined,
    year: undefined,
    sortFilter: undefined,
  });
  useSWR(requestObj);

  useEffect(() => {
    const { subjectName, examType, year, sortFilter } = searchInputs;
    setFilter({ subjectName, examType, year, sortFilter });
  }, [JSON.stringify(searchInputs)]);

  const handleApplyFilters = () => {
    setFilters(filter);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Triiger</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-y-4]">
        <SheetHeader>
          <SheetTitle className="flex flex-row gap-x-4">
            <IoFilter className="text-2xl font-bold" /> Filter Options
          </SheetTitle>
        </SheetHeader>
        <Accordion>
          {SEARCH_FILTTER_OPTIONS.map(({ key, label, options }, index) => (
            <AccordionItem key={key} aria-label={key} title={label}>
              <OptionGroup
                key={index}
                filter={filter}
                setFilter={setFilter}
                filterKey={key}
                options={options}
              />
            </AccordionItem>
          ))}
        </Accordion>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleApplyFilters}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
