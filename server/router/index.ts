import commentRouter from './filePreview/comments/router';
import { router } from '../config/trpcConfig';

export const appRouter = router({ comment: commentRouter });

export type AppRouter = typeof appRouter;
