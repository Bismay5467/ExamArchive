import { Button } from '@/components/ui/button';
import ResultCard from './ResultCard/ResultCard';

export default function Search() {
  return (
    <div className="max-w-[1280px] mx-auto min-h-[400px] sm:grid sm:grid-cols-10 sm:gap-x-4">
      <div className="flex flex-row justify-evenly sm:hidden">
        <Button>Sort</Button>
        <Button>Filter</Button>
      </div>
      <aside className="hidden bg-slate-300 sm:col-span-3 sm:block"></aside>
      <div className="p-4 sm:col-span-7">
        <ResultCard />
      </div>
    </div>
  );
}
