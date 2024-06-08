/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-props-no-spreading */
import debounce from 'lodash.debounce';
import { useEffect } from 'react';
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '../ui/button.tsx';
import { CLIENT_ROUTES } from '@/constants/routes.ts';
import { ISearchInput } from '@/types/search.ts';
import { Input } from '@/components/ui/input.tsx';
import Logo from '../../assets/Logo.png';
import ModeToggle from '../ModeToggle.tsx';
import { QUERY_FIELDS } from '@/constants/search.ts';
import { useAuth } from '@/hooks/useAuth.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { register, handleSubmit, setValue } = useForm<ISearchInput>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const {
    authState: { isAuth, username },
    RESET,
  } = useAuth();
  const DELAY_IN_MS = 500;
  const search = (query: string) => {
    if (currentLocation.pathname === '/') navigate(CLIENT_ROUTES.SEARCH);
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, query });
  };
  const submitHandler: SubmitHandler<ISearchInput> = (formData) => {
    search(formData.query);
  };
  const debouncedSearch = debounce(
    (query: string) => search(query),
    DELAY_IN_MS
  );

  useEffect(() => {
    const query = searchParams.get(QUERY_FIELDS.QUERY) || '';
    setValue(QUERY_FIELDS.QUERY, query);
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
            <Button
              className="rounded-3xl"
              onClick={() =>
                navigate(CLIENT_ROUTES.AUTH_LOGIN, {
                  state: { from: currentLocation },
                })
              }
            >
              Log in
            </Button>
            <Button
              className="rounded-3xl"
              onClick={() =>
                navigate(CLIENT_ROUTES.AUTH_SIGNUP, {
                  state: { from: currentLocation },
                })
              }
            >
              Sign up
            </Button>
            <ModeToggle />
          </div>
        )}
      </div>
    </nav>
  );
}
