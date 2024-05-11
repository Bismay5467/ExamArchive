import { Button } from '@/components/ui/button';
import ResultCard from './ResultCard/ResultCard';
import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import DrawerFilter from './Filter/DrawerFilter';
import AsideFilter from './Filter/AsideFilter';

export default function Search() {
  return (
    <div className="max-w-[1280px] mx-auto min-h-[400px] sm:grid sm:grid-cols-10 sm:gap-x-4">
      <div className="flex flex-row justify-around sm:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Filter</Button>
          </DrawerTrigger>
          <DrawerFilter />
        </Drawer>
      </div>
      <AsideFilter />
      <div className="p-4 sm:col-span-7">
        <ResultCard />
      </div>
    </div>
  );
}
