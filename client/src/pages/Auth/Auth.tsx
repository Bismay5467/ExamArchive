import { Image } from '@nextui-org/react';
import { Outlet, useNavigate } from 'react-router-dom';
import LogoBanner from '@/assets/LogoBanner.png';
import { CLIENT_ROUTES } from '@/constants/routes';

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className="h-screen lg:grid lg:grid-cols-2 lg:gap-x-4">
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:col-span-1 p-4">
        <Image src="https://res.cloudinary.com/dzorpsnmn/image/upload/v1718026209/EXAM-ARCHIVE-ASSETS/qrid8c6h4buu5vxzvdob.jpg" />
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
  );
}
