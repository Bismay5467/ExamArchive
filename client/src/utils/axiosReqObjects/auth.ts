import { SERVER_ROUTES } from '@/constants/routes';
import { TSignInFormFields, TSignUpFormFields } from '@/types/auth';

export const getSignInObj = (userData: TSignInFormFields) => {
  const url = SERVER_ROUTES.LOGIN;
  const axiosObj = {
    url,
    data: { data: userData },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };

  return axiosObj;
};

export const getSignUpObj = (userData: TSignUpFormFields) => {
  const url = SERVER_ROUTES.SIGNUP;
  const axiosObj = {
    url,
    data: { data: userData },
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  return axiosObj;
};
