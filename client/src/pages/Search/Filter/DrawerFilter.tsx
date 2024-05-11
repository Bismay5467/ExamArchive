import { Button } from '@/components/ui/button';
import {
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

export default function DrawerFilter() {
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Choose your filters</DrawerTitle>
      </DrawerHeader>
      <DrawerFooter>
        <Button>Apply</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
}
