import {
  DownloadCount,
  EditTags,
  GetFile,
  UpdateRating,
  ViewCount,
} from '../../../controllers/filePreview';
import {
  editTagsInputSchema,
  getFileInputSchema,
  ratingInputSchema,
  updateDownloadCountInputSchema,
  updateViewCountInputSchema,
} from './schema';
import {
  protectedProcedures,
  publicProcedures,
  router,
} from '../../../config/trpcConfig';

const fileRouter = router({
  get: publicProcedures.input(getFileInputSchema).query(async ({ input }) => {
    const response = await GetFile(input);
    return response;
  }),
  editTags: protectedProcedures
    .input(editTagsInputSchema)
    .mutation(async ({ input }) => {
      await EditTags(input);
      return { message: 'New tags were added to the post' };
    }),
  downloadCount: protectedProcedures
    .input(updateDownloadCountInputSchema)
    .mutation(async ({ input }) => {
      await DownloadCount(input);
      return { message: 'Download count increased' };
    }),
  viewCount: protectedProcedures
    .input(updateViewCountInputSchema)
    .mutation(async ({ input }) => {
      await ViewCount(input);
      return { message: 'View count increased' };
    }),
  rating: protectedProcedures
    .input(ratingInputSchema)
    .mutation(async ({ input }) => {
      await UpdateRating(input);
      return { message: 'Your rating was successfully recorded. Thank You!' };
    }),
});

export default fileRouter;
