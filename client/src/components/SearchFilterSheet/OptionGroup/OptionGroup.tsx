/* eslint-disable no-unused-vars */
import { Radio, RadioGroup, cn } from '@nextui-org/react';
import React from 'react';
import { IFilterInputs } from '@/types/search';

export default function OptionGroup({
  filterKey,
  options,
  filter,
  setFilter,
}: {
  filterKey: string;
  options: Record<string, string>;
  filter: IFilterInputs;
  setFilter: React.Dispatch<React.SetStateAction<IFilterInputs>>;
}) {
  // console.log(filter, filterKey);
  return (
    <div className="flex flex-col gap-3">
      <RadioGroup
        defaultValue={filter[filterKey as keyof IFilterInputs] ?? ''}
        onValueChange={(val) =>
          setFilter((prevState) => ({
            ...prevState,
            [filterKey]: val as any,
          }))
        }
      >
        {Object.entries(options).map(([optionKey, optionVal]) => (
          <Radio
            key={optionKey}
            value={optionVal}
            color="secondary"
            classNames={{
              base: cn(
                'inline-flex m-0 items-center justify-between',
                'flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-3 border-2 border-slate-300',
                'data-[selected=true]:border-secondary font-natosans'
              ),
            }}
          >
            {optionVal}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
