import { IFilterInputs } from '@/types/search.ts';
import FilterForm from './FilterForm/FilterForm';
import React from 'react';

export default function AsideFilter({
  filters,
  setFilters,
}: {
  filters: IFilterInputs;
  setFilters: React.Dispatch<React.SetStateAction<IFilterInputs>>;
}) {
  return (
    <aside className="hidden bg-slate-300 sm:col-span-3 sm:block">
      <FilterForm filters={filters} setFilters={setFilters} />
    </aside>
  );
}
