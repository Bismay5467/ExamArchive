import { NavLink } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { CLIENT_ROUTES } from '@/constants/routes';
import IconWrapper from '@/components/Sidebar/NavCard/IconWrapper/IconWrapper';
import logo from '@/assets/Logo.png';
import { useAuth } from '@/hooks/useAuth';
import ModeToggle from '../../ModeToggle';
import Notification from '../../Notification/Notification';
import sidebarOptions from '@/constants/sidebarOptions';
import NavCard from '../NavCard/NavCard';
import UserAvatar from '../../UserAvatar/UserAvatar';

const ESC_KEY_CODE = 27;

export default function MobileSidebar({
  setToken,
}: {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}) {
  const {
    authState: { userId, role },
  } = useAuth();
  const nonActiveClass = 'text-slate-600';

  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const trigger = useRef<HTMLButtonElement>(null);
  const mobileNav = useRef<HTMLDivElement>(null);

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: EventTarget | null }): void => {
      if (!mobileNav.current || !trigger.current) return;
      if (
        !mobileNavOpen ||
        mobileNav.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      ) {
        return;
      }
      setMobileNavOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: { keyCode: number }): void => {
      if (!mobileNavOpen || keyCode !== ESC_KEY_CODE) return;
      setMobileNavOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <>
      <button
        type="button"
        ref={trigger}
        className={`hamburger sm:hidden z-50 fixed bg-[#faf3de] p-4 rounded-full right-8 bottom-8 ${mobileNavOpen && 'active'}`}
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="w-6 h-6 fill-current text-gray-700 transition duration-150 ease-in-out"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="4" width="24" height="2" rx="1" className="fill-pink-500" />
          <rect y="11" width="24" height="2" rx="1" className="fill-pink-500" />
          <rect y="18" width="24" height="2" rx="1" className="fill-pink-500" />
        </svg>
      </button>
      <nav
        id="mobile-sidebar"
        ref={mobileNav}
        className="fixed sm:hidden z-50 group h-screen overflow-x-hidden transition-all duration-300 ease-in-out font-natosans"
        style={
          mobileNavOpen
            ? { maxWidth: mobileNav.current?.scrollWidth, opacity: 1 }
            : { maxWidth: 0, opacity: 0.8 }
        }
      >
        <div className="bg-[#f7f7f7] h-screen relative w-[260px] flex flex-col gap-y-16 p-3">
          <NavLink to={CLIENT_ROUTES.HOME} className="flex flex-row gap-x-2">
            <img
              src={logo}
              alt="LOGO"
              className="mix-blend-multiply w-[45px]"
            />
            <h1 className="self-center text-xl font-semibold text-[#545454]">
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
              <p className={`self-center text-base ${nonActiveClass}`}>
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
    </>
  );
}
