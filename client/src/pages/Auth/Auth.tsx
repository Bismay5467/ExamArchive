import { Image } from '@nextui-org/react';
import { Outlet, useNavigate } from 'react-router-dom';
import LogoBanner from '@/assets/logo-banner-no-bg.png';
import Cartoon from '@/assets/login_no_bg.png';
import { CLIENT_ROUTES } from '@/constants/routes';
import CTABanner from '@/components/CTABanner/CTABanner';

export default function Signup() {
  const navigate = useNavigate();
  return (
    <>
      <CTABanner />
      <div className="h-screen lg:grid lg:grid-cols-2 lg:gap-x-4">
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center lg:col-span-1 p-4">
          <Image src={Cartoon} />
        </div>
        <div className="h-full px-4 flex flex-col gap-y-4 justify-center items-center lg:col-span-1">
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
    </>
  );
}
