import { Filter, FilterInputs } from '@/types';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function FilterForm() {
  const { register, handleSubmit, reset, setValue } = useForm<FilterInputs>();
  const [searchParams, setSearchParams] = useSearchParams({});

  const submitHandler: SubmitHandler<FilterInputs> = (formData) => {
    const currentParams: { [key: string]: string } = {
      query: searchParams.get('query') || '',
    };

    const updatedParams = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (value === false) return acc;
        acc[key] = String(value);
        return acc;
      },
      currentParams
    );

    // Update search parameters
    const newSearchParams = new URLSearchParams();
    Object.entries(updatedParams).forEach(([key, value]) => {
      newSearchParams.set(key, value);
    });

    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    reset();
    Array.from(searchParams.entries()).forEach(([key, value]) => {
      if (key === 'query') return;
      setValue(key as Filter, value === 'true');
    });
  }, [searchParams]);

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="px-4">
      <input id="filter1" type="checkbox" {...register('filter1')} />
      <label htmlFor="filter1">Filter-1</label>
      <br />
      <input id="filter2" type="checkbox" {...register('filter2')} />
      <label htmlFor="filter2">Filter-2</label>
      <br />
      <input id="filter3" type="checkbox" {...register('filter3')} />
      <label htmlFor="filter3">Filter-3</label>
      <br />
      <div className="flex flex-col gap-y-2">
        <Button type="submit">Apply</Button>
        <Button onClick={() => reset()}>Clear all</Button>
      </div>
    </form>
  );
}
