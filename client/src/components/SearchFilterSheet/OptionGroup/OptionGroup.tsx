import { cn, CheckboxGroup, Checkbox } from '@nextui-org/react';
import React from 'react';
import { IFilterInputs } from '@/types/search';

export default function OptionGroup({
  filterKey,
  options,
  multiple,
  filter,
  setFilter,
}: {
  filterKey: string;
  options: Record<string, string>;
  multiple: boolean;
  filter: IFilterInputs;
  setFilter: React.Dispatch<React.SetStateAction<IFilterInputs>>;
}) {
  const handleChange = (selectedKeys: string[]) => {
    // if (selectedKeys.length === 1) {
    //   console.log(selectedKeys);

    //   const newFilter = Object.fromEntries(
    //     Object.entries(filter).filter(([key, _]) => key !== filterKey)
    //   );
    //   console.log(newFilter);

    //   setFilter(newFilter);
    //   return;
    // }

    if (multiple) {
      setFilter((prevState) => ({
        ...prevState,
        [filterKey]: selectedKeys.join(',') as any,
      }));
    } else {
      const selectedKey = selectedKeys[selectedKeys.length - 1];
      setFilter((prevState) => ({
        ...prevState,
        [filterKey]: selectedKey as any,
      }));
    }
  };
  return (
    <div className="flex flex-col gap-1 w-full">
      <CheckboxGroup
        aria-label={filterKey}
        value={
          multiple
            ? filter[filterKey as keyof IFilterInputs]?.split(',') ?? []
            : [filter[filterKey as keyof IFilterInputs] ?? '']
        }
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
                'inline-flex max-w-md w-full bg-content1 m-0',
                'hover:bg-content2 items-center justify-start',
                'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                'data-[selected=true]:border-secondary'
              ),
              label: 'w-full',
            }}
            value={optionVal}
          >
            <div className="w-full flex justify-between gap-2">{optionVal}</div>
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
