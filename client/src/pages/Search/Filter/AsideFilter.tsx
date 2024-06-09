import FilterForm from './FilterForm/FilterForm';
import { IFilterInputs } from '@/types/search.ts';

export default function AsideFilter({
  filters,
  handleFilterSubmit,
}: {
  filters: IFilterInputs;
  handleFilterSubmit: (_newFilters: IFilterInputs) => void;
}) {
  return (
    <aside className="hidden bg-slate-300 sm:col-span-3 sm:block">
      <FilterForm filters={filters} handleFilterSubmit={handleFilterSubmit} />
    </aside>
  );
}
