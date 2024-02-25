import {
  DeleteComment,
  EditComment,
  GetComments,
  PostComment,
  ReactOnComments,
} from '../../../controllers/filePreview';
import {
  deleteCommentInputSchema,
  editCommentInputSchema,
  getCommentsInputSchema,
  postCommentsInputSchema,
  reactCommentInputSchema,
} from './schema';
import {
  protectedProcedures,
  publicProcedures,
  router,
} from '../../../config/trpcConfig';

const commentRouter = router({
  get: publicProcedures
    .input(getCommentsInputSchema)
    .query(async ({ input }) => {
      const response = await GetComments(input);
      return response;
    }),
  post: protectedProcedures
    .input(postCommentsInputSchema)
    .mutation(async ({ input }) => {
      const response = await PostComment(input);
      return response;
    }),
  edit: protectedProcedures
    .input(editCommentInputSchema)
    .mutation(async ({ input }) => {
      await EditComment(input);
      return { message: 'Comment was edited successfully' };
    }),
  delete: protectedProcedures
    .input(deleteCommentInputSchema)
    .mutation(async ({ input }) => {
      await DeleteComment(input);
      return { message: 'Comment was deleted successfully' };
    }),
  react: protectedProcedures
    .input(reactCommentInputSchema)
    .mutation(async ({ input }) => {
      const response = await ReactOnComments(input);
      return response;
    }),
});

export default commentRouter;
