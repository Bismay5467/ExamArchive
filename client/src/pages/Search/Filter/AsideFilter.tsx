import { IFilterInputs } from '@/types/search.ts';
import FilterForm from './FilterForm/FilterForm';

export default function AsideFilter({
  filters,
  handleFilterSubmit,
}: {
  filters: IFilterInputs;
  handleFilterSubmit: (newFilters: IFilterInputs) => void;
}) {
  return (
    <aside className="hidden bg-slate-300 sm:col-span-3 sm:block">
      <FilterForm filters={filters} handleFilterSubmit={handleFilterSubmit} />
    </aside>
  );
}
