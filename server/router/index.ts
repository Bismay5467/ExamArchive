import authRouter from './auth/router';
import bookmarkRouter from './bookmark/router';
import commentRouter from './filePreview/comments/router';
import fileRouter from './filePreview/data/router';
import folderRoute from './folder/router';
import reportRouter from './report/router';
import searchRouter from './search/router';
import superAdminRouter from './superadmin/router';
import uploadRoute from './upload/router';

const AppRouter = [
  { segment: 'auth', router: authRouter },
  { segment: 'bookmark', router: bookmarkRouter },
  { segment: 'comment', router: commentRouter },
  { segment: 'file', router: fileRouter },
  { segment: 'folder', router: folderRoute },
  { segment: 'report', router: reportRouter },
  { segment: 'search', router: searchRouter },
  { segment: 'superAdmin', router: superAdminRouter },
  { segment: 'upload', router: uploadRoute },
] as const;

export default AppRouter;
