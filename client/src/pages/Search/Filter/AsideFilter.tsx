import FilterForm from './FilterForm/FilterForm';

export default function AsideFilter() {
  return (
    <aside className="hidden bg-slate-300 sm:col-span-3 sm:block">
      <FilterForm />
    </aside>
  );
}
