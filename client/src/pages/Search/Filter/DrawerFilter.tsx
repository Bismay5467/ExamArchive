import { Button } from '@/components/ui/button';
import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Drawer,
  DrawerTrigger,
} from '@/components/ui/drawer';
import FilterForm from './FilterForm/FilterForm';
import { IFilterInputs } from '@/types/search.ts';
import React from 'react';

export default function DrawerFilter({
  filters,
  setFilters,
}: {
  filters: IFilterInputs;
  setFilters: React.Dispatch<React.SetStateAction<IFilterInputs>>;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Filter</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Choose your filters</DrawerTitle>
        </DrawerHeader>
        <div>
          <FilterForm filters={filters} setFilters={setFilters} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
