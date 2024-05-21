import Logo from '../../assets/Logo.png';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '../ui/button.tsx';
import ModeToggle from '../ModeToggle.tsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SearchInput } from '@/types/index.ts';
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  NavLink,
  Link,
} from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useEffect } from 'react';

export default function Navbar() {
  const { register, handleSubmit, setValue } = useForm<SearchInput>();
  const [searchParams, setSearchParams] = useSearchParams({ query: '' });
  const navigate = useNavigate();
  const search = (query: string) => {
    if (query.length === 0) {
      setSearchParams({ query: '' });
      return;
    }
    const url = createSearchParams({ query: query }).toString();
    navigate(`/search?${url}`);
  };
  const submitHandler: SubmitHandler<SearchInput> = (formData) => {
    search(formData.query);
  };
  const debouncedSearch = debounce((query: string) => search(query), 500);

  useEffect(() => {
    const query = searchParams.get('query') || '';
    setValue('query', query);
  }, [searchParams]);

  return (
    <nav>
      <div className="max-w-[1280px] mx-auto py-2 flex flex-row justify-between">
        <div className="flex flex-row gap-x-4 items-center">
          <NavLink to={'/'}>
            <img src={Logo} alt="Logo" className="w-[200px]" />
          </NavLink>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-row gap-x-4 items-center"
          >
            <Input
              placeholder="Search"
              className="w-[300px]"
              {...register('query')}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
        <div className="flex flex-row gap-x-4 items-center">
          <Link to={'/auth/login'}>
            <Button className="rounded-3xl">Log in</Button>
          </Link>
          <Link to={'/auth/signup'}>
            <Button className="rounded-3xl">Sign up</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
