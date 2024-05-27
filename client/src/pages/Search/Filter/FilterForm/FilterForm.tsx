import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { FilterInputs } from '@/types';

export default function FilterForm() {
  const { register, handleSubmit, reset, setValue } = useForm<FilterInputs>();
  const [searchParams, setSearchParams] = useSearchParams();

  const submitHandler: SubmitHandler<FilterInputs> = (formData) => {
    const newSearchParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      newSearchParams.set(key, value);
    });
    Object.entries(formData).forEach(([key, value]) => {
      if (value === '') {
        newSearchParams.delete(key);
      } else if (key === 'year') {
        const currentYear = new Date().getFullYear();
        const last = Number(value);
        let yearString: string = '';
        for (let i = 0; i < last; i++)
          yearString += String(currentYear - i) + (i !== last - 1 ? ', ' : ' ');
        newSearchParams.set(key, yearString);
      } else newSearchParams.set(key, value);
    });

    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    searchParams.forEach((value, key) => {
      if (key === 'query') return;
      setValue(key as keyof FilterInputs, value);
    });
  }, []);

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="px-4">
      <label htmlFor="examtype">Exam Type</label>
      <br />
      <select id="examtype" {...register('ExamType')}>
        <option value="">Any</option>
        <option value="Mid Sem">Mid Sem</option>
        <option value="End Sem">End Sem</option>
      </select>
      <br />

      <label htmlFor="examtype">Subject Name</label>
      <br />
      <select id="subjectName" {...register('subjectName')}>
        <option value="">Any</option>
        <option value="Operating Systems">Operating Systems</option>
        <option value="Computer Networks">Computer Networks</option>
      </select>

      <br />

      <label htmlFor="examtype">Sort By</label>
      <br />
      <select id="examtype" {...register('sortFilter')}>
        <option value="">Relevance</option>
        <option value="MOST RECENT">MOST RECENT</option>
        <option value="MOST VIEWS">MOST VIEWS</option>
      </select>
      <br />
      <label htmlFor="year">Year</label>
      <select id="year" {...register('year')}>
        <option value="">Select</option>
        <option value="3">Last 3 Years</option>
        <option value="5">Last 5 Years</option>
        <option value="10">Last 10 Years</option>
      </select>
      <br />
      {/* <input id="filter3" type="checkbox" {...register('filter3')} />
      <label htmlFor="filter3">Filter-3</label> */}
      <br />
      <div className="flex flex-col gap-y-2">
        <Button type="submit">Apply</Button>
        <Button onClick={() => reset()}>Clear all</Button>
      </div>
    </form>
  );
}
