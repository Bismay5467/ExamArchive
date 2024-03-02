import authRouter from './auth/router';
import bookmarkRouter from './bookmark/router';
import commentRouter from './filePreview/comments/router';
import fileRouter from './filePreview/data/router';
import folderRoute from './folder/router';
import { router } from '../config/trpcConfig';

export const appRouter = router({
  comment: commentRouter,
  file: fileRouter,
  auth: authRouter,
  folder: folderRoute,
  bookmark: bookmarkRouter,
});

export type AppRouter = typeof appRouter;
