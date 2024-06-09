/* eslint-disable react/jsx-no-constructed-context-values */

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import React, { createContext, useContext, useState } from 'react';

import { AUTH_TOKEN, ROLES } from '@/constants/auth';
import { IAuthContext, IAuthState, ISignInJwtPayload } from '@/types/auth';

const DefaultState: IAuthState = {
  email: undefined,
  isAuth: false,
  jwtToken: undefined,
  role: ROLES.GUEST,
  userId: undefined,
  username: undefined,
};

const AuthContext = createContext<IAuthContext>({
  authState: DefaultState,
  SET: () => {},
  RESET: () => {},
});

const getCurrentState = () => {
  const jwtToken: string = Cookies.get(AUTH_TOKEN) || '';
  if (jwtToken.length === 0) return DefaultState;

  const { email, role, userId, username }: ISignInJwtPayload =
    jwtDecode(jwtToken);
  return {
    email,
    isAuth: true,
    jwtToken,
    role,
    userId,
    username,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setUserData] = useState<IAuthState>(getCurrentState());

  const SET = () => {
    const jwtToken: string = Cookies.get(AUTH_TOKEN) ?? '';
    if (jwtToken.length === 0) {
      toast.error('Error!', {
        description: 'Auth token missing',
        duration: 5000,
      });
      return;
    }
    const { email, role, userId, username }: ISignInJwtPayload =
      jwtDecode(jwtToken);
    const newAuthState: IAuthState = {
      email,
      isAuth: true,
      jwtToken,
      role,
      userId,
      username,
    };
    setUserData(newAuthState);
  };

  const RESET = () => {
    Cookies.remove(AUTH_TOKEN);
    setUserData(DefaultState);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ authState, SET, RESET }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
