import { toast } from 'sonner';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { CLIENT_ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

export default function DashBoard() {
  const {
    authState: { isAuth },
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      toast.error('Whoops! You seem to be logged out!', {
        description: 'Authorization Required',
        duration: 5000,
      });
      navigate(CLIENT_ROUTES.HOME, { replace: true });
    }
  }, [isAuth]);

  return (
    <main>
      <Outlet />
    </main>
  );
}
