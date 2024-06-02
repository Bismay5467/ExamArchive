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
  useLocation,
} from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import debounce from 'lodash.debounce';
import { useEffect } from 'react';
import { CLIENT_ROUTES } from '@/constants/routes.ts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth.tsx';

export default function Navbar() {
  const { register, handleSubmit, setValue } = useForm<ISearchInput>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const {
    authState: { isAuth, username },
    RESET,
  } = useAuth();

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
          <NavLink to={CLIENT_ROUTES.HOME}>
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
        {isAuth ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                <AvatarFallback className="bg-pink-100">
                  {username?.at(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem onClick={() => RESET()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex flex-row gap-x-4 items-center">
            <NavLink to={CLIENT_ROUTES.AUTH_LOGIN}>
              <Button className="rounded-3xl">Log in</Button>
            </NavLink>
            <NavLink to={CLIENT_ROUTES.AUTH_SIGNUP}>
              <Button className="rounded-3xl">Sign up</Button>
            </NavLink>
            <ModeToggle />
          </div>
        )}
      </div>
    </nav>
  );
}
