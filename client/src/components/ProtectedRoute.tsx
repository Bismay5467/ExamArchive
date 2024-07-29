import { toast } from 'sonner';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CLIENT_ROUTES } from '@/constants/routes';
import { ROLES } from '../constants/auth';
import { useAuth } from '@/hooks/useAuth';

function ProtectedRoute({
  roles,
  redirectUrl = CLIENT_ROUTES.AUTH_LOGIN,
  unAuthRedirectURl = CLIENT_ROUTES.FORBIDDEN,
}: {
  roles: Array<keyof typeof ROLES>;
  redirectUrl?: string;
  unAuthRedirectURl?: string;
}) {
  const {
    authState: { isAuth, role },
  } = useAuth();
  const { pathname } = useLocation();
  if (role === 'GUEST' && roles.includes(role)) return <Outlet />;
  if (isAuth === false) {
    toast.error('Whoops! You seem to be logged out!', {
      description: 'Authorization required for this action',
      duration: 6000,
    });
    return <Navigate to={redirectUrl} state={{ from: pathname }} />;
  }
  if (isAuth && roles.includes(role) === false) {
    return <Navigate to={unAuthRedirectURl} replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
