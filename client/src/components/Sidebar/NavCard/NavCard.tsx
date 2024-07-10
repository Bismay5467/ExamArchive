/* eslint-disable no-nested-ternary */
import { NavLink } from 'react-router-dom';
import React from 'react';
import { cn } from '@nextui-org/theme';
import { Chip } from '@nextui-org/react';
import IconWrapper from './IconWrapper/IconWrapper';

export default function NavCard({
  link,
  icon,
  name,
  className,
  isReady,
}: {
  link: string;
  className: string;
  name: string;
  icon: React.ReactNode;
  isReady: boolean;
}) {
  const activeClass = 'text-pink-600';
  const nonActiveClass = 'text-slate-600';
  const disabledClass = 'text-slate-400';
  return (
    <NavLink
      to={link}
      className={cn(className, `${isReady ? '' : 'pointer-events-none'}`)}
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
            {isReady === false && (
              <Chip
                size="sm"
                radius="full"
                className="ml-5 text-purple-500 border border-purple-500"
                variant="bordered"
              >
                SOON
              </Chip>
            )}
          </p>
        </>
      )}
    </NavLink>
  );
}
