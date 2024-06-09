import { Button } from '@/components/ui/button';
import FilterForm from './FilterForm/FilterForm';
import { IFilterInputs } from '@/types/search.ts';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

export default function DrawerFilter({
  filters,
  handleFilterSubmit,
}: {
  filters: IFilterInputs;
  handleFilterSubmit: (_newFilters: IFilterInputs) => void;
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
          <FilterForm
            filters={filters}
            handleFilterSubmit={handleFilterSubmit}
          />
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
