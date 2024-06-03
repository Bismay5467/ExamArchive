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
    const { email, role, userId, username }: ISignInJwtPayload =
      jwtDecode(jwtToken);
    return {
      email,
      isAuth: true,
      jwtToken: jwtToken,
      role,
      userId,
      username,
    };
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setUserData] = useState<IAuthState>(getCurrentState());

  const SET = () => {
    const jwtToken: string = Cookies.get('auth-token') || '';
    if (jwtToken.length === 0) {
      toast.error('Error!', {
        description: 'Auth-Token missing',
        duration: 5000,
      });
      return;
    }
    const { email, role, userId, username }: ISignInJwtPayload =
      jwtDecode(jwtToken);
    const newAuthState: IAuthState = {
      email,
      isAuth: true,
      jwtToken: jwtToken,
      role,
      userId,
      username,
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
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error('useAuth must be used within a AuthProvider');

  return context;
};
