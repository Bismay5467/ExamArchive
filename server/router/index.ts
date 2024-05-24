// import adminRouter from './admin/router';
import authRouter from './auth/router';
import bookmarkRouter from './bookmark/router';
import commentRouter from './filePreview/comments/router';
import fileRouter from './filePreview/data/router';
import folderRoute from './folder/router';
// import reportRouter from './report/router';
import searchRouter from './search/router';
import uploadRoute from './upload/router';

const AppRouter = [
  { segment: 'auth', router: authRouter },
  { segment: 'bookmark', router: bookmarkRouter },
  { segment: 'comment', router: commentRouter },
  { segment: 'file', router: fileRouter },
  { segment: 'folder', router: folderRoute },
  { segment: 'search', router: searchRouter },
  // { segment: 'report', router: reportRouter },
  { segment: 'upload', router: uploadRoute },
] as const;

//   admin: adminRouter,

export default AppRouter;
