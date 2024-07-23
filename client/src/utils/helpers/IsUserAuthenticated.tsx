import { toast } from 'sonner';
import { NavigateFunction } from 'react-router-dom';
import { CLIENT_ROUTES } from '@/constants/routes';

export const IsUserAuthenticated = (
  isAuth: boolean,
  navigate: NavigateFunction,
  from: string
) => {
  if (!isAuth) {
    toast.error('Whoops! You seem to be logged out!', {
      description: 'Authorization required for this action',
      duration: 6000,
    });
    navigate(CLIENT_ROUTES.AUTH_LOGIN, { state: { from } });
    return false;
  }
  return true;
};
