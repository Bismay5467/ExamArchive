import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { IoBookmarkOutline, IoCloudUploadOutline } from 'react-icons/io5';
import { LuFileSearch2 } from 'react-icons/lu';
import { TbBrandGoogleAnalytics } from 'react-icons/tb';
import { FaRegCircleUser } from 'react-icons/fa6';
import { LiaSignOutAltSolid } from 'react-icons/lia';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useState } from 'react';
import { CLIENT_ROUTES } from '@/constants/routes';
import IconWrapper from '@/components/Sidebar/IconWrapper/IconWrapper';
import logo from '@/assets/Logo.png';
import { useAuth } from '@/hooks/useAuth';
import ModeToggle from '../ModeToggle';
import Notification from '../Notification/Notification';
import { AUTH_TOKEN } from '@/constants/auth';
import { TEMP_JWT_TOKEN_HARDCODED, TEMP_JWT_TOKEN_HARDCODED_SUPERADMIN } from '@/constants/shared';

export default function Sidebar() {
  const [token, setToken] = useState<string>('');
  // TODO: Remove Manual setting of cookie afterwards
  Cookies.set(AUTH_TOKEN, token);
  const {
    authState: { userId, role, username },
    RESET,
  } = useAuth();

  const activeClass = 'text-pink-600';
  const nonActiveClass = 'text-slate-600';
  const baseRoute = `dashboard/${userId}`;

  const iconClasses =
    'text-xl text-slate-700 pointer-events-none flex-shrink-0';

  return (
    <nav className="fixed z-50 group h-screen w-[70px] rounded-r-xl overflow-x-hidden transition-all duration-300 ease-in-out hover:w-[240px] hover:rounded-r-lg font-natosans">
      <div className="bg-[#f7f7f7] relative h-full w-[240px] flex flex-col gap-y-16 p-3">
        <NavLink to={CLIENT_ROUTES.HOME} className="flex flex-row gap-x-2">
          <img src={logo} alt="LOGO" className="mix-blend-multiply w-[45px]" />
          <h1 className="self-center text-xl font-semibold text-[#545454] hidden group-hover:block">
            EXAM ARCHIVE
          </h1>
        </NavLink>
        <div className="flex flex-col gap-y-1">
          <NavLink
            to={CLIENT_ROUTES.SEARCH}
            className="flex flex-row gap-x-4 py-2 px-1 rounded-lg hover:bg-white"
          >
            {({ isActive }) => (
              <>
                <IconWrapper
                  className={`self-center ${isActive ? activeClass : nonActiveClass}`}
                >
                  <LuFileSearch2 className="text-xl" />
                </IconWrapper>
                <p
                  className={`self-center text-base hidden group-hover:block ${isActive ? activeClass : nonActiveClass}`}
                >
                  Search
                </p>
              </>
            )}
          </NavLink>
          <NavLink
            to={`${baseRoute}/${CLIENT_ROUTES.DASHBOARD_BOOKMARKS}`}
            className="flex flex-row gap-x-4 py-2 px-1 rounded-lg hover:bg-white"
          >
            {({ isActive }) => (
              <>
                <IconWrapper
                  className={`self-center ${isActive ? activeClass : nonActiveClass}`}
                >
                  <IoBookmarkOutline className="text-xl" />
                </IconWrapper>
                <p
                  className={`self-center text-base hidden group-hover:block ${isActive ? activeClass : nonActiveClass}`}
                >
                  Bookmarks
                </p>
              </>
            )}
          </NavLink>
          <div className="flex flex-row gap-x-4 py-2 px-1 rounded-lg cursor-not-allowed hover:bg-white">
            <IconWrapper className="self-center ">
              <TbBrandGoogleAnalytics className="text-xl text-slate-400" />
            </IconWrapper>
            <div>
              <p className="self-center text-sm text-slate-400 hidden group-hover:block">
                Analytics
              </p>
              <p className="self-center text-sm text-slate-400 hidden group-hover:block">
                Comming Soon
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-1">
          <NavLink
            to={`${baseRoute}/${CLIENT_ROUTES.DASHBOARD_FILEUPLOAD}`}
            className="flex flex-row gap-x-4 py-2 px-1 rounded-lg hover:bg-white"
          >
            {({ isActive }) => (
              <>
                <IconWrapper
                  className={`self-center ${isActive ? activeClass : nonActiveClass}`}
                >
                  <IoCloudUploadOutline className="text-xl" />
                </IconWrapper>
                <p
                  className={`self-center text-base hidden group-hover:block ${isActive ? activeClass : nonActiveClass}`}
                >
                  Upload
                </p>
              </>
            )}
          </NavLink>
        </div>
        <div className="flex flex-col gap-y-2 mt-auto">
          <div className="flex flex-row gap-x-4 py-2 px-1 rounded-lg hover:bg-white hover:cursor-pointer">
            <Notification
              applicationIdentifier={
                import.meta.env.VITE_NOVU_APPLLICATION_IDENTIFIER
              }
              subscriberId={userId ?? ''}
            />
            <p
              className={`self-center text-base hidden group-hover:block ${nonActiveClass}`}
            >
              Notification
            </p>
          </div>
          <div className="flex flex-row justify-between">
            <div className="py-2 px-1">
              <Dropdown
                placement="bottom-end"
                radius="sm"
                className="font-natosans"
              >
                <DropdownTrigger>
                  <div className="flex flex-row gap-x-4 cursor-pointer">
                    <Avatar
                      isBordered
                      radius="sm"
                      src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                    />
                    <div>
                      <p className="self-center text-sm hidden group-hover:block">
                        {username}
                      </p>
                      <p className="self-center text-sm opacity-60 hidden group-hover:block">
                        @{role.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions" variant="light">
                  <DropdownItem
                    key="user"
                    startContent={<FaRegCircleUser className={iconClasses} />}
                    onClick={() => {
                      setToken(TEMP_JWT_TOKEN_HARDCODED);
                      window.location.reload();
                    }}
                  >
                    User
                  </DropdownItem>
                  <DropdownItem
                    key="admin"
                    startContent={<FaRegCircleUser className={iconClasses} />}
                    onClick={() => {
                      setToken(TEMP_JWT_TOKEN_HARDCODED);
                      window.location.reload();
                    }}
                  >
                    Admin
                  </DropdownItem>
                  <DropdownItem
                    key="superadmin"
                    startContent={<FaRegCircleUser className={iconClasses} />}
                    onClick={() => {
                      setToken(TEMP_JWT_TOKEN_HARDCODED_SUPERADMIN);
                      window.location.reload();
                    }}
                  >
                    Super Admin
                  </DropdownItem>
                  <DropdownItem
                    key="signout"
                    startContent={
                      <LiaSignOutAltSolid className={iconClasses} />
                    }
                    onClick={() => RESET()}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <ModeToggle className="hover:cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
}
