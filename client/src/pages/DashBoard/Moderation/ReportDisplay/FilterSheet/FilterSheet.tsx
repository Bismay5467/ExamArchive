import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import { IoFilter } from 'react-icons/io5';
import { TbFilterSearch } from 'react-icons/tb';
import React, { useState } from 'react';
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
import OptionGroup from './OptionGroup/OptionGroup';
import { REPORT_FILTTER_OPTIONS } from '@/constants/report';
import { IReportFilterFields, TReportAction } from '@/types/report';

export function FilterSheet({
  setReportFilters,
  action,
}: {
  setReportFilters: React.Dispatch<React.SetStateAction<IReportFilterFields>>;
  action: TReportAction;
}) {
  const [filters, setFilters] = useState<IReportFilterFields>({ action });
  //   useEffect(() => {
  //     const { subjectName, examType, year, sortFilter } = searchInputs;
  //     setFilter({ subjectName, examType, year, sortFilter });
  //   }, [JSON.stringify(searchInputs)]);

  const handleClearFilters = () => {
    setReportFilters({ action });
    setFilters({ action });
  };

  const handleApplyFilters = () => {
    setReportFilters(filters);
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
            {REPORT_FILTTER_OPTIONS.map(
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
                      filter={filters}
                      setReportFilters={setFilters}
                      filterKey={key}
                      options={options as Record<string, string>}
                    />
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
