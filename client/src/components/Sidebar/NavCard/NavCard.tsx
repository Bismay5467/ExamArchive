/* eslint-disable no-nested-ternary */
import { NavLink } from 'react-router-dom';
import React from 'react';
import { cn } from '@nextui-org/theme';
import IconWrapper from './IconWrapper/IconWrapper';

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
  const activeClass = 'text-pink-600';
  const nonActiveClass = 'text-slate-600';
  const disabledClass = 'text-slate-400';
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
