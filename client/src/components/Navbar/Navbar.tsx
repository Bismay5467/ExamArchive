import debounce from 'lodash.debounce';
import { useEffect } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  User,
} from '@nextui-org/react';
import { FaSearch, FaSignOutAlt } from 'react-icons/fa';
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import { CLIENT_ROUTES } from '@/constants/routes.ts';
import { ISearchInput } from '@/types/search.ts';
import LogoBanner from '@/assets/LogoBanner.png';
import ModeToggle from '../ModeToggle';
import { QUERY_FIELDS } from '@/constants/search.ts';
import { useAuth } from '@/hooks/useAuth.tsx';
import { getNavDropDown } from '@/constants/dropDownOptions';

export default function Navbar() {
  const { register, handleSubmit, setValue } = useForm<ISearchInput>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const dashboardRegex = /\/dashboard/;
  const isDashBoardPage = dashboardRegex.test(currentLocation.pathname);
  const {
    authState: { isAuth, username, role, userId },
    RESET,
  } = useAuth();
  const DELAY_IN_MS = 500;
  const search = (query: string) => {
    if (currentLocation.pathname !== CLIENT_ROUTES.SEARCH) {
      navigate(CLIENT_ROUTES.SEARCH);
    }
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

  const getAvatarInitials = () =>
    `https://ui-avatars.com/api/?name=${username}&&size=128&background=0D8ABC&color=fff`;

  useEffect(() => {
    const query = searchParams.get(QUERY_FIELDS.QUERY) || '';
    setValue(QUERY_FIELDS.QUERY, query);
  }, [searchParams]);

  return (
    <nav className="flex pr-8 pl-4 py-4 flex-row justify-between max-w-[1280px] mx-auto">
      <section className="flex flex-row gap-6">
        {!isDashBoardPage && (
          <NavLink to={CLIENT_ROUTES.HOME}>
            <img
              src={LogoBanner}
              className="w-[200px] hidden sm:block"
              alt=""
            />
          </NavLink>
        )}
        <form onSubmit={handleSubmit(submitHandler)} className="self-center">
          <Input
            classNames={{
              base: 'max-w-full sm:w-[300px]',
              mainWrapper: 'h-full',
              input: 'text-small',
              inputWrapper:
                'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
            }}
            placeholder="Search (Comma Separated)"
            size="lg"
            startContent={<FaSearch />}
            type="search"
            {...register('query')}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </form>
      </section>

      <section className="self-center flex flex-row gap-x-4">
        <ModeToggle />
        {isAuth ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <User
                name={username}
                description={`@${role.toLowerCase()}`}
                className="cursor-pointer font-semibold"
                avatarProps={{
                  isBordered: true,
                  radius: 'sm',
                  className: 'transition-transform',
                  color: 'default',
                  size: 'md',
                  src: getAvatarInitials(),
                }}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownSection title="Actions" aria-label="Profile Actions">
                {getNavDropDown(role, userId!).map(({ name, link }) => (
                  <DropdownItem
                    key={name}
                    onClick={() => navigate(link)}
                    textValue={name}
                  >
                    {name}
                  </DropdownItem>
                ))}
              </DropdownSection>
              <DropdownSection aria-label="user control">
                <DropdownItem
                  color="danger"
                  startContent={<FaSignOutAlt />}
                  key="signout"
                  textValue="Sign Out"
                  onClick={() => RESET()}
                >
                  {' '}
                  Sign Out
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button
            color="primary"
            href="#"
            variant="flat"
            onClick={() =>
              navigate(CLIENT_ROUTES.AUTH_LOGIN, {
                state: { from: currentLocation },
              })
            }
          >
            Sign In
          </Button>
        )}
      </section>
    </nav>
  );
}
