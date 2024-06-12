import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Listbox, ListboxItem } from '@nextui-org/react';

import { CLIENT_ROUTES } from '@/constants/routes';
import IconWrapper from '@/components/Sidebar/IconWrapper/IconWrapper';
import { cn } from '@/lib/utils';
import logoBanner from '@/assets/LogoBanner.png';
import { useAuth } from '@/hooks/useAuth';
import { getSidebarDropDown } from '@/constants/dropDownOptions';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLHtmlElement> {}

export default function Sidebar({ className, ...props }: InputProps) {
  const {
    authState: { userId, role },
  } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className={cn('p-4', className)} {...props}>
      <div className="bg-[#faf6f6] h-full rounded-3xl flex flex-col items-center gap-8 p-6">
        <Link to={CLIENT_ROUTES.HOME}>
          <img
            src={logoBanner}
            alt="LOGO"
            className="mix-blend-multiply w-[220px]"
          />
        </Link>
        <Listbox
          aria-label="User Menu"
          className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80 bg-content1 max-w-[300px] overflow-visible shadow-small rounded-medium"
          itemClasses={{
            base: 'px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80',
          }}
        >
          {getSidebarDropDown(role, userId!).map(
            ({ key, endContent, iconWrapperClass, link, startContent }) => (
              <ListboxItem
                key={key}
                endContent={endContent}
                startContent={
                  <IconWrapper className={iconWrapperClass}>
                    {startContent}
                  </IconWrapper>
                }
                onClick={() => navigate(link)}
              >
                {key}
              </ListboxItem>
            )
          )}
        </Listbox>
      </div>
    </aside>
  );
}
