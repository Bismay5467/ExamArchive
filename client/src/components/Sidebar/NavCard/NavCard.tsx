/* eslint-disable no-nested-ternary */
import { NavLink } from 'react-router-dom';
import React from 'react';
import { cn } from '@nextui-org/theme';
import IconWrapper from './IconWrapper/IconWrapper';
import { useTheme } from '@/hooks/useTheme';

export default function NavCard({
  link,
  icon,
  name,
  className,
  isReady,
  setMobileNavOpen,
}: {
  link: string;
  className: string;
  name: string;
  icon: React.ReactNode;
  isReady: boolean;
  setMobileNavOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { theme } = useTheme();
  const activeClass = 'text-pink-600';
  const nonActiveClass =
    theme === 'light' ? 'text-slate-600' : 'text-slate-400';
  const disabledClass = theme === 'light' ? 'text-slate-400' : 'text-slate-600';
  return (
    <NavLink
      to={link}
      className={cn(className, `${isReady ? '' : 'pointer-events-none'}`)}
      {...(setMobileNavOpen && { onClick: () => setMobileNavOpen(false) })}
    >
      {({ isActive }) => (
        <>
          <IconWrapper
            className={`self-center ${isReady === false ? disabledClass : isActive ? activeClass : nonActiveClass}`}
          >
            {icon}
          </IconWrapper>
          <p
            className={`self-center my-auto text-base sm:hidden sm:group-hover:block ${isReady === false ? disabledClass : isActive ? activeClass : nonActiveClass}`}
          >
            {name}
            {!isReady && (
              <span className=" text-purple-500 border border-purple-500 text-xs px-2 py-1 rounded-full ml-4">
                SOON
              </span>
            )}
          </p>
        </>
      )}
    </NavLink>
  );
}
