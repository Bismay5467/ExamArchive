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

export default function DrawerFilter({
  filters,
  handleFilterSubmit,
}: {
  filters: IFilterInputs;
  handleFilterSubmit: (newFilters: IFilterInputs) => void;
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
