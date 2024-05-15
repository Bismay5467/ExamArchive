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

export default function DrawerFilter() {
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
          <FilterForm />
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
