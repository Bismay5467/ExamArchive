import { Button, RadioGroup, Radio } from '@nextui-org/react';
import { IoFilter } from 'react-icons/io5';
import useSWR from 'swr';
import { AxiosRequestConfig } from 'axios';
import React, { useState } from 'react';
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
import { IFilterInputs, TExamType, TSortFilters, TYear } from '@/types/search';
import { SEARCH_FILTTER_OPTIONS } from '@/constants/search';

export function SearchFilterSheet() {
  const requestObj: AxiosRequestConfig<any> = {
    url: `${SERVER_ROUTES.SEARCH}/getSubjectFilters`,
    method: 'GET',
  };
  const [filter, setFilter] = useState<IFilterInputs>({
    subjectName: undefined,
    examType: undefined,
    year: undefined,
    sortFilter: undefined,
  });
  const { setFilters } = useSearch();
  useSWR(requestObj);

  // console.log(response);

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
        {Object.entries(SEARCH_FILTTER_OPTIONS).map(([key, options], index) => (
          <React.Fragment key={index}>
            <div className="w-full h-0.5 bg-slate-200" />
            <div className="flex flex-col gap-3">
              <RadioGroup
                label={`${key} :`}
                onValueChange={(value) =>
                  setFilter((prevState) => ({
                    ...prevState,
                    ...(key === 'Sort by' && {
                      sortFilter: value as TSortFilters,
                    }),
                    ...(key === 'Year' && { year: value as TYear }),
                    ...(key === 'Exam type' && {
                      examType: value as TExamType<'INSTITUTIONAL'>,
                    }),
                  }))
                }
              >
                {Object.values(options).map((value) => (
                  <Radio key={value} value={value}>
                    {value}
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </React.Fragment>
        ))}
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
