import { NextUIProvider } from '@nextui-org/system';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import Error from './pages/404/Error.tsx';
import Home from './pages/Home/Home.tsx';
import Root from './Root.tsx';
import Search from './pages/Search/Search.tsx';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { ROLES } from './constants/auth.ts';
import ForbiddenPage from './pages/Forbidden.tsx';

const Preview = React.lazy(() => import('./pages/Preview/Preview.tsx'));
const Signup = React.lazy(() => import('./pages/Auth/Signup/Signup.tsx'));
const Login = React.lazy(() => import('./pages/Auth/Login/Login.tsx'));
const Reset = React.lazy(() => import('./pages/Auth/Reset/Reset.tsx'));
const DashBoard = React.lazy(() => import('@/pages/DashBoard/DashBoard.tsx'));
const Profile = React.lazy(
  () => import('@/pages/DashBoard/Profile/Profile.tsx')
);
const Bookmarks = React.lazy(
  () => import('@/pages/DashBoard/Bookmarks/Bookmarks.tsx')
);
const Analytics = React.lazy(
  () => import('@/pages/DashBoard/Analytics/Analytics.tsx')
);
const FileUpload = React.lazy(
  () => import('@/pages/DashBoard/FileUpload/FileUpload.tsx')
);
const DashHome = React.lazy(
  () => import('@/pages/DashBoard/DashHome/DashHome.tsx')
);
const Operations = React.lazy(
  () => import('@/pages/DashBoard/Operations/Operations.tsx')
);
const Moderation = React.lazy(
  () => import('@/pages/DashBoard/Moderation/Moderation.tsx')
);
const TabularFolderView = React.lazy(
  () => import('@/components/TabularView/TabularFolderView.tsx')
);
const TabularFileView = React.lazy(
  () => import('@/components/TabularView/TabularFileView.tsx')
);
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<Error />}>
      <Route path="" element={<Home />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route
        element={
          <ProtectedRoute roles={[ROLES.ADMIN, ROLES.USER, ROLES.GUEST]} />
        }
      >
        <Route path="/search" element={<Search />} />
      </Route>
      <Route path="preview/:paperid" element={<Preview />} />
      <Route path="dashboard/:userid/" element={<DashBoard />}>
        <Route path="" element={<DashHome />} />
        <Route path="profile" element={<Profile />} />
        <Route element={<ProtectedRoute roles={[ROLES.SUPERADMIN]} />}>
          <Route path="operations" element={<Operations />} />
          <Route path="moderation" element={<Moderation />} />
        </Route>
        <Route element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.USER]} />}>
          <Route path="bookmarks" element={<Bookmarks />}>
            <Route
              path=""
              element={<TabularFolderView actionVarient="BOOKMARK" />}
            />
            <Route
              path=":folderId"
              element={<TabularFileView actionVarient="BOOKMARK" />}
            />
          </Route>
        </Route>
        <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
          <Route path="fileupload" element={<FileUpload />}>
            <Route
              path=""
              element={<TabularFolderView actionVarient="UPLOAD" />}
            />
            <Route
              path=":folderId"
              element={<TabularFileView actionVarient="UPLOAD" />}
            />
          </Route>
        </Route>
        <Route path="analytics" element={<Analytics />} />
      </Route>
      <Route path="auth">
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="reset" element={<Reset />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>
);
