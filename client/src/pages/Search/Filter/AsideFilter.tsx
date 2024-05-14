import { FilterInputs } from '@/types';
import { useForm, SubmitHandler } from 'react-hook-form';
import FilterForm from './FilterForm/FilterForm';

export default function AsideFilter() {
  const { register, handleSubmit } = useForm<FilterInputs>();
  return (
    <aside className="hidden bg-slate-300 sm:col-span-3 sm:block">
      <form>
        <FilterForm register={register} />
      </form>
    </aside>
  );
}
