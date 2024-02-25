import { JWTPayload, SignJWT, jwtVerify } from 'jose';

import { IJWTPayload } from '../../types/auth/types';

export const verifyTokens = async ({
  token,
}: {
  token: string;
}): Promise<null | JWTPayload> => {
  if (!process.env.JWT_SECRET) {
    console.error(
      'JWT secret is missing. You need to provide one to generate a token'
    );
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch (error: any) {
    return null;
  }
};

export const signTokens = async ({
  payload,
  JWT_MAX_AGE,
}: {
  payload: IJWTPayload;
  JWT_MAX_AGE: string | number;
}): Promise<string | null> => {
  if (!process.env.JWT_SECRET) {
    console.error(
      'JWT secret is missing. You need to provide one to generate a token'
    );
    return null;
  }

  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(JWT_MAX_AGE)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    return token;
  } catch (error: any) {
    return null;
  }
};
