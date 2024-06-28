import { Radio, RadioGroup } from '@nextui-org/react';
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
          <Radio key={optionKey} value={optionVal}>
            {optionVal}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
