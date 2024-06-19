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
      <Route path="search" element={<Search />} />
      <Route path="preview/:paperid" element={<Preview />} />
      <Route path="dashboard/:userid/" element={<DashBoard />}>
        <Route path="" element={<DashHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="bookmarks" element={<Bookmarks />}>
          <Route path="" element={<TabularFolderView />} />
          <Route path=":folderId" element={<TabularFileView />} />
        </Route>
        <Route path="fileupload" element={<FileUpload />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
      <Route path="auth/login" element={<Login />} />
      <Route path="auth/signup" element={<Signup />} />
      <Route path="auth/reset" element={<Reset />} />
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
