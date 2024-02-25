import commentRouter from './filePreview/comments/router';
import fileRouter from './filePreview/data/router';
import { router } from '../config/trpcConfig';

export const appRouter = router({ comment: commentRouter, file: fileRouter });

export type AppRouter = typeof appRouter;
