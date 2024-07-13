import { Image } from '@nextui-org/react';
import { Outlet, useNavigate } from 'react-router-dom';
import LogoBanner from '@/assets/LogoBanner.png';
import { CLIENT_ROUTES } from '@/constants/routes';

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className="p-4 h-screen lg:grid lg:grid-cols-2 lg:gap-x-4">
      <div className="hidden bg-signup-banner bg-no-repeat bg-cover bg-right lg:block lg:col-span-1 lg:rounded-3xl" />
      <div className="h-full flex flex-col gap-y-4 justify-center items-center lg:col-span-1">
        <Image
          width={250}
          alt="Logo Banner"
          className="cursor-pointer"
          src={LogoBanner}
          onClick={() => navigate(CLIENT_ROUTES.HOME)}
        />
        <Outlet />
      </div>
    </div>
  );
}
