/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-props-no-spreading */
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
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

import { Button } from '../ui/button.tsx';
import { CLIENT_ROUTES } from '@/constants/routes.ts';
import { ISearchInput } from '@/types/search.ts';
import { Input } from '@/components/ui/input.tsx';
import Logo from '../../assets/Logo.png';
import ModeToggle from '../ModeToggle.tsx';
import { QUERY_FIELDS } from '@/constants/search.ts';
import { useAuth } from '@/hooks/useAuth.tsx';
import axios from 'axios';
import { EXAM_TYPES, SEMESTER } from '@/constants/shared';
import Cookies from 'js-cookie';
import { AUTH_TOKEN } from '@/constants/auth';

export default function Navbar() {
  const { register, handleSubmit, setValue } = useForm<ISearchInput>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const [filedata, setFileData] = useState();
  const dashboardRegex = /\/dashboard/;
  const isDashBoardPage = dashboardRegex.test(currentLocation.pathname);
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

  const handleChange = (event) => {
    const [file] = event.target.files;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64String = e.target?.result as string;
        setFileData((prevState) =>
          (prevState ?? []).concat({
            file: {
              dataURI: base64String,
              name: file.name,
            },
            folderId: '66641ed1bac1de6d39484eda',
            examType: EXAM_TYPES.INSTITUTIONAL.MIDSEM,
            institution: 'National Institute of Technology, Karnataka',
            branch: 'CSE',
            year: '2014',
            semester: SEMESTER.III,
            subjectCode: 'MA567',
            subjectName: 'Discrete Mathematics',
            tags: 'tag1,tag2',
          })
        );
      };
    }
  };
  const handleFormSubmit = async () => {
    // const url = 'https://examarchive-1.onrender.com/api/v1/upload';
    const url = 'http://localhost:3000/api/v1/upload';
    const token = Cookies.get(AUTH_TOKEN);
    const res = await axios({
      url,
      method: 'POST',
      data: { data: filedata },
      headers: { authorization: `Bearer ${token}` },
    });
    console.log(res);
  };

  return (
    <nav>
      <div className="max-w-[1280px] mx-auto py-2 flex flex-row justify-between">
        <div className="flex flex-row gap-x-4 items-center">
          <NavLink to={CLIENT_ROUTES.HOME}>
            <img src={Logo} alt="Logo" className="w-[200px]" />
          </NavLink>
        )}
        <input type="file" onChange={handleChange} />
        <button type="button" onClick={handleFormSubmit}>
          SUBMIT
        </button>
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
