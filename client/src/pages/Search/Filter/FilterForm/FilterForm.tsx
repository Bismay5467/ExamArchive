import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect } from 'react';
import { IFilterInputs, TFilterInputs } from '@/types/search.ts';

export default function FilterForm({
  filters,
  handleFilterSubmit,
}: {
  filters: IFilterInputs;
  handleFilterSubmit: (newFilters: IFilterInputs) => void;
}) {
  const { register, handleSubmit, setValue, reset } = useForm<IFilterInputs>();

  const submitHandler: SubmitHandler<IFilterInputs> = (formData) => {
    const newFilters: IFilterInputs = {};
    Object.entries(formData).forEach(([key, value]) => {
      newFilters[key as keyof IFilterInputs] = value;
    });

    handleFilterSubmit(newFilters);
  };

  useEffect(() => {
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'query') return;
      setValue(key as TFilterInputs, value);
    });
  }, [filters]);

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="px-4">
      <label htmlFor="examtype">Exam Type</label>
      <br />
      <select
        id="examtype"
        {...register('ExamType')}
        defaultValue={filters.ExamType}
      >
        <option value="">Any</option>
        <option value="Mid Sem">Mid Sem</option>
        <option value="End Sem">End Sem</option>
      </select>
      <br />

      <label htmlFor="examtype">Subject Name</label>
      <br />
      <select
        id="subjectName"
        {...register('subjectName')}
        defaultValue={filters.subjectName}
      >
        <option value="">Any</option>
        <option value="Operating Systems">Operating Systems</option>
        <option value="Computer Networks">Computer Networks</option>
      </select>

      <br />

      <label htmlFor="sortFilter">Sort By</label>
      <br />
      <select
        id="sortFilter"
        {...register('sortFilter')}
        defaultValue={filters.sortFilter}
      >
        <option value="">Relevance</option>
        <option value="MOST RECENT">MOST RECENT</option>
        <option value="MOST VIEWS">MOST VIEWS</option>
      </select>
      <br />
      <label htmlFor="year">Year</label>
      <select id="year" {...register('year')}>
        <option value="">Select</option>
        <option value="Last 3 Years">Last 3 Years</option>
        <option value="Last 5 Years">Last 5 Years</option>
        <option value="Last 10 Years">Last 10 Years</option>
      </select>
      <br />
      <br />
      <div className="flex flex-col gap-y-2">
        <Button type="submit">Apply</Button>
        <Button
          onClick={() => {
            handleFilterSubmit({});
            reset();
          }}
        >
          Clear all
        </Button>
      </div>
    </form>
  );
}
