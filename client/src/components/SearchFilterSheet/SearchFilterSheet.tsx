import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
} from '@nextui-org/react';
import { IoFilter } from 'react-icons/io5';
import { TbFilterSearch } from 'react-icons/tb';
import useSWR from 'swr';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { LuCheckCircle } from 'react-icons/lu';
import { MdClear } from 'react-icons/md';
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
  const { setFilters, searchInputs, clearFilters } = useSearch();
  const [filter, setFilter] = useState<IFilterInputs>({
    subjectName: undefined,
    examType: undefined,
    year: undefined,
    sortFilter: undefined,
  });
  const { data: response } = useSWR(requestObj);

  useEffect(() => {
    if (response) {
      SEARCH_FILTTER_OPTIONS.push({
        component: 'autocomplete',
        key: 'subjectName',
        label: 'Subject Name',
        options: response.data.data.map((val: any, idx: number) => ({
          key: idx.toString(),
          val: val.subjectName,
        })),
        multiple: false,
      });
    }
  }, [JSON.stringify(response)]);

  useEffect(() => {
    const { subjectName, examType, year, sortFilter } = searchInputs;
    setFilter({ subjectName, examType, year, sortFilter });
  }, [JSON.stringify(searchInputs)]);

  const handleApplyFilters = () => {
    setFilters(filter);
  };
  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          isIconOnly
          color="default"
          aria-label="filter"
          variant="bordered"
        >
          <TbFilterSearch className="text-lg" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-y-4 w-[320px] font-natosans">
        <SheetHeader>
          <SheetTitle className="flex flex-row gap-x-4">
            <IoFilter className="text-2xl font-bold" /> FILTER OPTIONS
          </SheetTitle>
        </SheetHeader>
        <div className="no-scrollbar overflow-y-auto h-[100%]">
          <Accordion>
            {SEARCH_FILTTER_OPTIONS.map(
              ({ key, label, options, component }, index) => (
                <AccordionItem
                  key={key}
                  aria-label={key}
                  title={
                    <p className="text-base font-bold text-slate-600">
                      {label}
                    </p>
                  }
                >
                  {component === 'radio' && (
                    <OptionGroup
                      key={index}
                      filter={filter}
                      setFilter={setFilter}
                      filterKey={key}
                      options={options as Record<string, string>}
                      // multiple={multiple}
                    />
                  )}
                  {component === 'autocomplete' && (
                    <Autocomplete
                      variant="bordered"
                      // defaultItems={options as Record<string, string>[]}
                      placeholder="Select exam types"
                      className="max-w-xs h-9"
                      radius="full"
                      key={index}
                      // defaultSelectedKey={
                      //   filter[key as keyof IFilterInputs] ?? ''
                      // }
                      // onSelectionChange={(val) => {
                      //   console.log(val);
                      //   setFilter((prevState) => ({
                      //     ...prevState,
                      //     [key]: val as any,
                      //   }));
                      // }}
                    >
                      {[{ key: 'abc', val: 'abc', label: 'abc' }].map(
                        (option) => (
                          <AutocompleteItem key={option.key} value={option.val}>
                            {option.label}
                          </AutocompleteItem>
                        )
                      )}
                    </Autocomplete>
                  )}
                </AccordionItem>
              )
            )}
          </Accordion>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <div className="flex flex-col gap-y-4 w-[100%]">
              <Button
                className="w-[100%] text-md"
                type="submit"
                variant="bordered"
                color="primary"
                radius="sm"
                startContent={<LuCheckCircle />}
                onClick={handleApplyFilters}
              >
                APPLY ALL
              </Button>
              <Button
                className="w-[100%] text-md"
                type="submit"
                variant="bordered"
                color="danger"
                radius="sm"
                startContent={<MdClear />}
                onClick={handleClearFilters}
              >
                CLEAR ALL
              </Button>
            </div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
