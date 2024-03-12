import { IUser } from '../../types/auth/types';
import { AddToBookMarks, RemoveBookMark } from '../../controllers/bookmark';
import { addBookmarkInputSchema, removeBookmarkInputSchema } from './schema';
import { protectedProcedures, router } from '../../config/trpcConfig';

const bookmarkRouter = router({
  add: protectedProcedures
    .input(addBookmarkInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.user as IUser;
      await AddToBookMarks({ ...input, userId });
      return { message: 'File added to bookmark' };
    }),
  remove: protectedProcedures
    .input(removeBookmarkInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.user as IUser;
      await RemoveBookMark({ ...input, userId });
      return { message: 'File removed from bookmark' };
    }),
});

export default bookmarkRouter;
