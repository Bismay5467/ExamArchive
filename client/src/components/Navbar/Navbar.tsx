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
} from 'react-router-dom';

export default function Navbar() {
  const { register, handleSubmit } = useForm<SearchInput>();
  const [searchParams, setSearchParams] = useSearchParams({ query: '' });
  const navigate = useNavigate();
  const submitHandler: SubmitHandler<SearchInput> = (formData) => {
    setSearchParams({ query: formData.query });
    const url = createSearchParams({ query: formData.query }).toString();
    navigate(`/search?${url}`);
  };
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
              defaultValue={searchParams.get('query')!}
              placeholder="Search"
              className="w-[300px]"
              {...register('query')}
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
        <div className="flex flex-row gap-x-4 items-center">
          <Button className="rounded-3xl">Log in</Button>
          <Button className="rounded-3xl">Sign up</Button>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
