import { Radio, RadioGroup } from '@nextui-org/react';
import React from 'react';
import { IFilterInputs } from '@/types/search';

export default function OptionGroup({
  label,
  filterKey,
  options,
  filter,
  setFilter,
}: {
  label: string;
  filterKey: string;
  options: Record<string, string>;
  filter: IFilterInputs;
  setFilter: React.Dispatch<React.SetStateAction<IFilterInputs>>;
}) {
  return (
    <>
      <div className="w-full h-0.5 bg-slate-200" />
      <div className="flex flex-col gap-3">
        <RadioGroup
          label={`${label} :`}
          defaultValue={filter[filterKey as keyof IFilterInputs] ?? ''}
          onValueChange={(val) =>
            setFilter((prevState) => ({
              ...prevState,
              [filterKey]: val as any,
            }))
          }
        >
          {Object.entries(options).map(([optionKey, optionVal]) => (
            <Radio key={optionKey} value={optionVal}>
              {optionVal}
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </>
  );
}
