import { Navigate, Outlet } from 'react-router-dom';
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
  if (role === 'GUEST' && roles.includes(role)) return <Outlet />;
  if (isAuth === false) return <Navigate to={redirectUrl} replace />;
  if (isAuth && roles.includes(role) === false) {
    return <Navigate to={unAuthRedirectURl} replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
