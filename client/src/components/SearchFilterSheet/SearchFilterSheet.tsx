import { Button, RadioGroup, Radio } from '@nextui-org/react';
import { IoFilter } from 'react-icons/io5';
import useSWR from 'swr';
import { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';
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

export function SearchFilterSheet() {
  const requestObj: AxiosRequestConfig<any> = {
    url: `${SERVER_ROUTES.SEARCH}/getSubjectFilters`,
    method: 'GET',
  };
  const [sortFilter, setSortFilter] = useState<string>();
  const { data: response } = useSWR(requestObj);
  // eslint-disable-next-line no-console
  console.log(response);

  const { setFilters } = useSearch();

  const handleApplyFilters = useCallback(() => {
    setFilters({ sortFilter });
  }, []);

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
        <div className="w-full h-0.5 bg-slate-200" />
        <div className="flex flex-col gap-3">
          <RadioGroup label="Sort by:" onValueChange={setSortFilter}>
            <Radio value="Most Recent">Most Recent</Radio>
            <Radio value="Most Views">Most Views</Radio>
          </RadioGroup>
        </div>
        <div className="w-full h-0.5 bg-slate-200" />
        <div className="flex flex-col gap-3">
          <RadioGroup label="Year:">
            <Radio value="buenos-aires">Past 3 Years</Radio>
            <Radio value="sydney">Past 5 Years</Radio>
            <Radio value="ds">Past 10 Years</Radio>
          </RadioGroup>
        </div>
        <div className="w-full h-0.5 bg-slate-200" />
        <div className="flex flex-col gap-3">
          <RadioGroup label="Exam Type:">
            <Radio value="buenos-aires">End Sem</Radio>
            <Radio value="sydney">Mid Sem</Radio>
          </RadioGroup>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={() => handleApplyFilters()}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
