import { IoAnalyticsSharp } from 'react-icons/io5';
import { IoMdPerson } from 'react-icons/io';
import React from 'react';
import { RiDiscussFill } from 'react-icons/ri';
import { TbMessageReport } from 'react-icons/tb';
import { FaBookmark, FaChevronRight, FaFileUpload } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Listbox, ListboxItem } from '@nextui-org/react';

import { CLIENT_ROUTES } from '@/constants/routes';
import IconWrapper from '@/components/Sidebar/IconWrapper/IconWrapper';
import ItemCounter from '@/components/Sidebar/ItemCounter/ItemCounter';
import { cn } from '@/lib/utils';
import logoBanner from '@/assets/LogoBanner.png';
import { useAuth } from '@/hooks/useAuth';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Sidebar({ className, ...props }: InputProps) {
  const {
    authState: { userId },
  } = useAuth();
  const navigate = useNavigate();
  const baseRoute = `dashboard/${userId}`;

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
          <ListboxItem
            key="issues"
            endContent={<FaChevronRight className="text-xl text-default-400" />}
            startContent={
              <IconWrapper className="bg-success/10 text-success">
                <IoMdPerson className="text-lg " />
              </IconWrapper>
            }
            onClick={() =>
              navigate(`${baseRoute}/${CLIENT_ROUTES.DASHBOARD_PROFILE}`)
            }
          >
            Profile
          </ListboxItem>
          <ListboxItem
            key="pull_requests"
            endContent={<ItemCounter number={6} />}
            startContent={
              <IconWrapper className="bg-primary/10 text-primary">
                <FaBookmark className="text-lg" />
              </IconWrapper>
            }
            onClick={() =>
              navigate(`${baseRoute}/${CLIENT_ROUTES.DASHBOARD_BOOKMARKS}`)
            }
          >
            Bookmarks
          </ListboxItem>
          <ListboxItem
            key="discussions"
            endContent={<ItemCounter number={293} />}
            startContent={
              <IconWrapper className="bg-secondary/10 text-secondary">
                <RiDiscussFill className="text-lg " />
              </IconWrapper>
            }
          >
            Discussions
          </ListboxItem>
          <ListboxItem
            key="actions"
            endContent={<FaChevronRight className="text-xl text-default-400" />}
            startContent={
              <IconWrapper className="bg-warning/10 text-warning">
                <FaFileUpload className="text-lg " />
              </IconWrapper>
            }
            onClick={() =>
              navigate(`${baseRoute}/${CLIENT_ROUTES.DASHBOARD_FILEUPLOAD}`)
            }
          >
            Upload
          </ListboxItem>
          <ListboxItem
            key="projects"
            endContent={<FaChevronRight className="text-xl text-default-400" />}
            startContent={
              <IconWrapper className="bg-default/50 text-foreground">
                <IoAnalyticsSharp className="text-lg " />
              </IconWrapper>
            }
            onClick={() =>
              navigate(`${baseRoute}/${CLIENT_ROUTES.DASHBOARD_ANALYTICS}`)
            }
          >
            Analytics
          </ListboxItem>
          <ListboxItem
            key="contributors"
            endContent={<ItemCounter number={79} />}
            startContent={
              <IconWrapper className="bg-warning/10 text-warning">
                <TbMessageReport className="text-lg " />
              </IconWrapper>
            }
          >
            Complaints
          </ListboxItem>
        </Listbox>
      </div>
    </aside>
  );
}
