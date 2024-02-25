import * as trpcExpress from '@trpc/server/adapters/express';
import { TRPCError, inferAsyncReturnType, initTRPC } from '@trpc/server';

import { IUser } from '../types/auth/types';
import { verifyTokens } from '../utils/auth/jsonwebtokens';

export const createContext = async ({
  req,
}: trpcExpress.CreateExpressContextOptions) => {
  const verifyUser = async () => {
    if (req.headers.authorization) {
      const user = await verifyTokens({
        token: req.headers.authorization.split(' ')[1],
      });
      return user as IUser | null;
    }
    return null;
  };
  const user = await verifyUser();
  return { user };
};
type Context = inferAsyncReturnType<typeof createContext>;

const TRPCInstance = initTRPC.context<Context>().create();

export const { router, mergeRouters } = TRPCInstance;

export const publicProcedures = TRPCInstance.procedure;

export const protectedProcedures = TRPCInstance.procedure.use((opts) => {
  const { ctx } = opts;

  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return opts.next({ ctx: { user: ctx.user } });
});
