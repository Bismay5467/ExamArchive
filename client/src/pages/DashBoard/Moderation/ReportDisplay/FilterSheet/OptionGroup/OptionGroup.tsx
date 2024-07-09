import { cn, CheckboxGroup, Checkbox } from '@nextui-org/react';
import React from 'react';
import { IReportFilterFields } from '@/types/report';

export default function ReportFilterOptionGroup({
  filterKey,
  filter,
  options,
  setReportFilters,
}: {
  filterKey: string;
  filter: IReportFilterFields;
  options: Record<string, string>;
  setReportFilters: React.Dispatch<React.SetStateAction<IReportFilterFields>>;
}) {
  const handleChange = (selectedKeys: string[]) => {
    setReportFilters((prevState) => ({
      ...prevState,
      [filterKey]: selectedKeys[selectedKeys.length - 1] as any,
    }));
  };
  return (
    <div className="flex flex-col gap-1 w-full">
      <CheckboxGroup
        aria-label={filterKey}
        value={[filter[filterKey as keyof IReportFilterFields] ?? '']}
        onChange={handleChange}
        classNames={{
          base: 'w-full',
        }}
      >
        {Object.entries(options).map(([optionKey, optionVal]) => (
          <Checkbox
            aria-label={optionKey}
            key={optionKey}
            color="secondary"
            classNames={{
              base: cn(
                'inline-flex max-w-md w-full bg-content1 m-0 ',
                'flex flex-row justify-between',
                // 'hover:bg-content2 items-center justify-start',
                'cursor-pointer rounded-lg gap-2 py-3 px-4 border-2 border-slate-300',
                'data-[selected=true]:border-secondary'
              ),
              label: 'w-full',
            }}
            value={optionVal}
            radius="full"
          >
            <div className="w-full flex justify-between gap-2">{optionVal}</div>
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
