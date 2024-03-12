import { AUTH_TOKEN, COOKIES_TTL } from '../../constants/constants/auth';
import { NewUser, Reset, SignIn } from '../../controllers/auth';
import {
  newUserInputSchema,
  resetInputSchema,
  signInUserInputSchema,
} from './schema';
import { publicProcedures, router } from '../../config/trpcConfig';

const authRouter = router({
  newUser: publicProcedures
    .input(newUserInputSchema)
    .mutation(async ({ input, ctx }) => {
      const token = await NewUser(input);
      ctx.res.cookie(AUTH_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIES_TTL,
        path: '/',
      });
      return { message: 'Welcome aboard!' };
    }),
  signIn: publicProcedures
    .input(signInUserInputSchema)
    .query(async ({ input, ctx }) => {
      const token = await SignIn(input);
      ctx.res.cookie(AUTH_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIES_TTL,
        path: '/',
      });
      return { message: 'Nice to see you again!' };
    }),
  reset: publicProcedures
    .input(resetInputSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.action === 'EMAIL') {
        await Reset(input);
        return { message: 'Please check your inbox' };
      }
      const token = await Reset(input);
      ctx.res.cookie(AUTH_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIES_TTL,
        path: '/',
      });
      return { message: 'Password successfully changed' };
    }),
});

export default authRouter;
