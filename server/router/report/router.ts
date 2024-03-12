import { TRPCError } from '@trpc/server';

import { IUser } from '../../types/auth/types';
import {
  MarkAsResolved,
  ReportContent,
  ViewReport,
} from '../../controllers/report';
import {
  markAsResolvedInputSchema,
  reportContentInputSchema,
  viewReportInputSchema,
} from './schema';
import { protectedProcedures, router } from '../../config/trpcConfig';

const reportRouter = router({
  report: protectedProcedures
    .input(reportContentInputSchema)
    .mutation(async ({ input }) => {
      await ReportContent(input);
      return {
        message:
          'Thanks for reporting. We will review the content and take the necessary steps',
      };
    }),
  view: protectedProcedures
    .input(viewReportInputSchema)
    .query(async ({ input, ctx }) => {
      const { role } = ctx.user as IUser;
      if (role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not permitted to see the data',
        });
      }
      const res = await ViewReport(input);
      return { ...res };
    }),
  markAsResolved: protectedProcedures
    .input(markAsResolvedInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { userId: adminId, role } = ctx.user as IUser;
      if (role !== 'ADMIN') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Access Denied' });
      }
      await MarkAsResolved({ ...input, adminId });
      return { message: 'Content was flagged successfully' };
    }),
});

export default reportRouter;
