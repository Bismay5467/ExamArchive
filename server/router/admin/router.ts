import { TRPCError } from '@trpc/server';

import { IUser } from '../../types/auth/types';
import { AddAdmin, GetAllAdmins, RemoveAdmin } from '../../controllers/admin';
import { addAdminInputSchema, removeAdminInputSchema } from './schema';

import { protectedProcedures, router } from '../../config/trpcConfig';

const adminRouter = router({
  add: protectedProcedures
    .input(addAdminInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { role } = ctx.user as IUser;
      if (role !== 'ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
      }
      await AddAdmin(input);
      return { message: 'New admin registered successfully' };
    }),
  remove: protectedProcedures
    .input(removeAdminInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { role, email } = ctx.user as IUser;
      if (role !== 'ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
      }
      if (email === input.email) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You cant remove yourself as a admin',
        });
      }
      await RemoveAdmin(input);
      return { message: 'One of the admin removed' };
    }),
  get: protectedProcedures.query(async ({ ctx }) => {
    const { role } = ctx.user as IUser;
    if (role !== 'ADMIN') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
    }
    const adminInfo = await GetAllAdmins();
    return { adminInfo };
  }),
});

export default adminRouter;
