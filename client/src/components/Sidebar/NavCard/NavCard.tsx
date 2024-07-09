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
}: {
  link: string;
  className: string;
  name: string;
  icon: React.ReactNode;
  isReady: boolean;
}) {
  const activeClass = 'text-pink-600';
  const nonActiveClass = 'text-slate-600';
  return (
    <NavLink
      to={link}
      className={cn(className, `${isReady ? '' : 'pointer-events-none'}`)}
    >
      {({ isActive }) => (
        <>
          <IconWrapper
            className={`self-center ${isActive ? activeClass : nonActiveClass}`}
          >
            {icon}
          </IconWrapper>
          {isReady ? (
            <p
              className={`self-center my-auto text-base hidden group-hover:block ${isActive ? activeClass : nonActiveClass}`}
            >
              {name}
            </p>
          ) : (
            <div className="py-2">
              {/* <p
                className={`self-center my-auto text-base hidden group-hover:block
                ${isActive ? activeClass : nonActiveClass}`}
              >
                {name}
              </p> */}
              <p className="self-center text-sm text-slate-400 hidden group-hover:block">
                Comming Soon
              </p>
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}
