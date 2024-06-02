import React, { createContext, useContext, useState } from 'react';
import { IAuthState, IAuthContext, IPayload } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

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
    const payload: IPayload = jwtDecode(jwtToken);
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

  const SET = (jwtToken: string) => {
    const payload: IPayload = jwtDecode(jwtToken);
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
