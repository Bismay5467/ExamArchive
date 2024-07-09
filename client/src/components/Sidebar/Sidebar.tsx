import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { CLIENT_ROUTES } from '@/constants/routes';
import IconWrapper from '@/components/Sidebar/NavCard/IconWrapper/IconWrapper';
import logo from '@/assets/Logo.png';
import { useAuth } from '@/hooks/useAuth';
import ModeToggle from '../ModeToggle';
import Notification from '../Notification/Notification';
import { AUTH_TOKEN } from '@/constants/auth';
import { TEMP_JWT_TOKEN_HARDCODED_ADMIN } from '@/constants/shared';
import sidebarOptions from '@/constants/sidebarOptions';
import NavCard from './NavCard/NavCard';
import UserAvatar from '../UserAvatar/UserAvatar';
import MobileSidebar from './MobileSidebar/MobileSidebar';

export default function Sidebar() {
  const [token, setToken] = useState<string>(
    Cookies.get(AUTH_TOKEN) ?? TEMP_JWT_TOKEN_HARDCODED_ADMIN
  );
  // TODO: Remove Manual setting of cookie afterwards
  Cookies.set(AUTH_TOKEN, token);
  const {
    authState: { userId, role },
  } = useAuth();
  const nonActiveClass = 'text-slate-600';

  return (
    <>
      <nav className="fixed hidden sm:block z-50 group h-[700px] w-[70px] top-[50%] -translate-y-[50%] rounded-r-xl overflow-x-hidden transition-all duration-300 ease-in-out hover:w-[240px] hover:rounded-r-lg font-natosans">
        <div className="bg-[#f7f7f7] relative h-full w-[240px] flex flex-col gap-y-16 p-3">
          <NavLink to={CLIENT_ROUTES.HOME} className="flex flex-row gap-x-2">
            <img
              src={logo}
              alt="LOGO"
              className="mix-blend-multiply w-[45px]"
            />
            <h1 className="self-center text-xl font-semibold text-[#545454] hidden group-hover:block">
              EXAM ARCHIVE
            </h1>
          </NavLink>
          {sidebarOptions(role, userId!).map((routeGroup, idx) => (
            <div className="flex flex-col gap-y-1" key={idx}>
              {routeGroup.map(({ icon, isReady, key, link }) => (
                <NavCard
                  icon={icon}
                  className="flex flex-row gap-x-4 py-2 px-1 rounded-lg hover:bg-white"
                  link={link}
                  isReady={isReady}
                  name={key}
                  key={key}
                />
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-y-2 mt-auto">
            <div className="flex flex-row gap-x-4 py-2 px-1 rounded-lg hover:bg-white hover:cursor-pointer">
              <IconWrapper className="self-center">
                <Notification
                  applicationIdentifier={
                    import.meta.env.VITE_NOVU_APPLLICATION_IDENTIFIER
                  }
                  subscriberId={userId ?? ''}
                />
              </IconWrapper>
              <p
                className={`self-center text-base hidden group-hover:block ${nonActiveClass}`}
              >
                Notification
              </p>
            </div>
            <div className="flex px-1 py-2 flex-row justify-between">
              <UserAvatar setToken={setToken} />
              <ModeToggle className="hover:cursor-pointer self-center" />
            </div>
          </div>
        </div>
      </nav>
      <MobileSidebar setToken={setToken} />
    </>
  );
}
