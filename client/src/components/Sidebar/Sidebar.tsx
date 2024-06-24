import { NavLink } from 'react-router-dom';
import { FaSearch, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { BiSolidBookmarkStar } from 'react-icons/bi';
import { SiGoogleanalytics } from 'react-icons/si';
import { IoIosNotifications } from 'react-icons/io';
import { IoCloudUpload } from 'react-icons/io5';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react';
import { CLIENT_ROUTES } from '@/constants/routes';
import IconWrapper from '@/components/Sidebar/IconWrapper/IconWrapper';
import logo from '@/assets/Logo.png';
import { useAuth } from '@/hooks/useAuth';
import ModeToggle from '../ModeToggle';

export default function Sidebar() {
  const {
    authState: { userId, role, username },
    RESET,
  } = useAuth();

  const activeClass = 'bg-primary/10 text-primary';
  const baseRoute = `dashboard/${userId}`;

  return (
    <nav className="fixed z-50 group max-h-[800px] h-[98%] w-[70px] rounded-r-xl overflow-x-hidden top-2 transition-all duration-300 ease-in-out hover:w-[240px] hover:rounded-r-lg">
      <div className="bg-[#faf6f6] relative h-full w-[240px] flex flex-col gap-y-16 p-3">
        <NavLink to={CLIENT_ROUTES.HOME} className="flex flex-row gap-x-2">
          <img src={logo} alt="LOGO" className="mix-blend-multiply w-[45px]" />
          <h1 className="self-center text-xl font-semibold text-[#545454] hidden group-hover:block">
            EXAM ARCHIVE
          </h1>
        </NavLink>
        <div className="flex flex-col gap-y-2">
          <NavLink
            to={CLIENT_ROUTES.SEARCH}
            className="flex flex-row gap-x-4 py-2 px-1 rounded-lg hover:bg-white"
          >
            {({ isActive }) => (
              <>
                <IconWrapper
                  className={`self-center ${isActive ? activeClass : ''}`}
                >
                  <FaSearch className="text-xl" />
                </IconWrapper>
                <p className="self-center text-xl font-semibold opacity-60 hidden group-hover:block">
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
                  className={`self-center ${isActive ? activeClass : 'text-red-600'}`}
                >
                  <BiSolidBookmarkStar className="text-2xl " />
                </IconWrapper>
                <p className="self-center text-xl font-semibold opacity-60 hidden group-hover:block">
                  Bookmarks
                </p>
              </>
            )}
          </NavLink>
          <div className="flex flex-row gap-x-4 py-2 px-1 rounded-lg cursor-not-allowed hover:bg-white">
            <IconWrapper className="self-center ">
              <SiGoogleanalytics className="text-xl " />
            </IconWrapper>
            <div>
              <p className="self-center text-sm font-semibold opacity-50 hidden group-hover:block">
                Analytics
              </p>
              <p className="self-center text-sm opacity-80 text-pink-500 hidden group-hover:block">
                Comming Soon
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 mt-auto">
          <NavLink
            to={`${baseRoute}/${CLIENT_ROUTES.DASHBOARD_FILEUPLOAD}`}
            className="flex flex-row gap-x-4 py-2 px-1 rounded-lg hover:bg-white"
          >
            {({ isActive }) => (
              <>
                <IconWrapper
                  className={`self-center ${isActive ? activeClass : ''}`}
                >
                  <IoCloudUpload className="text-2xl" />
                </IconWrapper>
                <p className="self-center text-xl font-semibold opacity-60 hidden group-hover:block">
                  Upload
                </p>
              </>
            )}
          </NavLink>
        </div>
        <div className="flex flex-col gap-y-2 mt-auto">
          <div className="flex flex-row gap-x-4 py-2 px-1 rounded-lg cursor-not-allowed hover:bg-white">
            <IconWrapper className="self-center ">
              <IoIosNotifications className="text-2xl" />
            </IconWrapper>
            <div>
              <p className="self-center text-sm font-semibold opacity-50 hidden group-hover:block">
                Notifications
              </p>
              <p className="self-center text-sm opacity-80 text-pink-500 hidden group-hover:block">
                Comming Soon
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-x-4 py-2 px-1">
            <IconWrapper className="self-center">
              <FaMoon className="text-2xl " />
            </IconWrapper>
            <ModeToggle className="self-center hidden group-hover:block" />
          </div>
          <div className="py-2 px-1">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex flex-row gap-x-4 cursor-pointer">
                  <Avatar
                    isBordered
                    radius="sm"
                    src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                  />
                  <div>
                    <p className="self-center text-sm font-semibold hidden group-hover:block">
                      {username}
                    </p>
                    <p className="self-center text-sm font-semibold opacity-60 hidden group-hover:block">
                      @{role.toLowerCase()}
                    </p>
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
