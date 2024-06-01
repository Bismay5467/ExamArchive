import Logo from '../../assets/Logo.png';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '../ui/button.tsx';
import ModeToggle from '../ModeToggle.tsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ISearchInput } from '@/types/search.ts';
import {
  useSearchParams,
  useNavigate,
  NavLink,
    Link,
  useLocation,
} from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useEffect } from 'react';
import { CLIENT_ROUTES } from '@/constants/routes.ts';

export default function Navbar() {
  const { register, handleSubmit, setValue } = useForm<ISearchInput>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const search = (query: string) => {
    if (currentLocation.pathname === '/') navigate(CLIENT_ROUTES.SEARCH);
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, query: query });
  };
  const submitHandler: SubmitHandler<ISearchInput> = (formData) => {
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
              placeholder="Search (Comma Separated)"
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
