import React, { createContext, useContext, useState } from 'react';
import { IAuthState, IAuthContext, ISignInJwtPayload } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const DefaultState: IAuthState = {
  email: undefined,
  isAuth: false,
  jwtToken: undefined,
  role: 'GUEST',
  userId: undefined,
  username: undefined,
};

const AuthContext = createContext<IAuthContext>({
  authState: DefaultState,
  SET: () => {},
  RESET: () => {},
});

const getCurrentState = () => {
  const jwtToken: string = Cookies.get('auth-token') || '';
  if (jwtToken.length === 0) return DefaultState;
  else {
    const payload: ISignInJwtPayload = jwtDecode(jwtToken);
    return {
      email: payload.email,
      isAuth: true,
      jwtToken: jwtToken,
      role: payload.role,
      userId: payload.userId,
      username: payload.username,
    };
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setUserData] = useState<IAuthState>(getCurrentState());

  const SET = () => {
    const jwtToken: string = Cookies.get('auth-token') || '';
    if (jwtToken.length === 0) {
      toast('Error', {
        description: 'Auth-Token missing',
      });
      return;
    }
    const payload: ISignInJwtPayload = jwtDecode(jwtToken);
    const newAuthState: IAuthState = {
      email: payload.email,
      isAuth: true,
      jwtToken: jwtToken,
      role: payload.role,
      userId: payload.userId,
      username: payload.username,
    };
    setUserData(newAuthState);
  };

  const RESET = () => {
    Cookies.remove('auth-token');
    setUserData(DefaultState);
  };

  return (
    <AuthContext.Provider value={{ authState, SET, RESET }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
