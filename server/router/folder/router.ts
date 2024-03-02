import { IUser } from '../../types/auth/types';
import {
  CreateFolder,
  DeleteFolder,
  GetFiles,
} from '../../controllers/folders';
import {
  createFolderInputSchema,
  deleteFolderInputSchema,
  getFilesInputSchema,
} from './schema';
import { protectedProcedures, router } from '../../config/trpcConfig';

const folderRoute = router({
  create: protectedProcedures
    .input(createFolderInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.user as IUser;
      await CreateFolder({ ...input, userId });
      return { message: 'New folder was created' };
    }),
  get: protectedProcedures
    .input(getFilesInputSchema)
    .query(async ({ input, ctx }) => {
      const { userId } = ctx.user as IUser;
      const res = await GetFiles({ ...input, userId });
      return { ...res };
    }),
  delete: protectedProcedures
    .input(deleteFolderInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx.user as IUser;
      await DeleteFolder({ ...input, userId });
      return { message: 'Folder was deleted' };
    }),
});

export default folderRoute;
