import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { FaRegCircleUser } from 'react-icons/fa6';
import { LiaSignOutAltSolid } from 'react-icons/lia';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '@/hooks/useAuth';
import {
  TEMP_JWT_TOKEN_HARDCODED_USER,
  TEMP_JWT_TOKEN_HARDCODED_ADMIN,
  TEMP_JWT_TOKEN_HARDCODED_SUPERADMIN,
} from '@/constants/shared';
import { AUTH_TOKEN } from '@/constants/auth';

export default function UserAvatar({
  sideBarClasses,
}: {
  sideBarClasses?: string;
}) {
  const [token, setToken] = useState<string>(Cookies.get(AUTH_TOKEN) ?? '');
  // TODO: Remove Manual setting of cookie afterwards
  useEffect(() => {
    if (token.length > 0) Cookies.set(AUTH_TOKEN, token);
  }, [token]);
  const {
    authState: { username, role },
    RESET,
  } = useAuth();

  const iconClasses =
    'text-xl text-slate-700 pointer-events-none flex-shrink-0';
  return (
    <Dropdown radius="sm" className="font-natosans">
      <DropdownTrigger>
        <div className="flex flex-row gap-x-4 cursor-pointer">
          <Avatar
            isBordered
            radius="sm"
            src="https://i.pravatar.cc/150?u=a04258114e29026302d"
          />
          <div>
            <p className={`self-center text-sm ${sideBarClasses}`}>
              {username}
            </p>
            <p className={`self-center text-sm opacity-60 ${sideBarClasses}`}>
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
            setToken(TEMP_JWT_TOKEN_HARDCODED_USER);
            window.location.reload();
          }}
        >
          User
        </DropdownItem>
        <DropdownItem
          key="admin"
          startContent={<FaRegCircleUser className={iconClasses} />}
          onClick={() => {
            setToken(TEMP_JWT_TOKEN_HARDCODED_ADMIN);
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
          startContent={<LiaSignOutAltSolid className={iconClasses} />}
          onClick={() => RESET()}
        >
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
