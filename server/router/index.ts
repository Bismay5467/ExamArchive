import adminRouter from './admin/router';
import authRouter from './auth/router';
import bookmarkRouter from './bookmark/router';
import commentRouter from './filePreview/comments/router';
import fileRouter from './filePreview/data/router';
import folderRoute from './folder/router';
import reportRouter from './report/router';
import { router } from '../config/trpcConfig';
import searchRouter from './search/router';
import uploadRoute from './upload/router';

export const appRouter = router({
  comment: commentRouter,
  file: fileRouter,
  auth: authRouter,
  folder: folderRoute,
  bookmark: bookmarkRouter,
  report: reportRouter,
  upload: uploadRoute,
  admin: adminRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
