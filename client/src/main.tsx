import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import './index.css';
import Root from './Root.tsx';
import Error from './pages/404/Error.tsx';
import Home from './pages/Home/Home.tsx';
import Search from './pages/Search/Search.tsx';
import DashBoard from './pages/DashBoard/DashBoard.tsx';

const Preview = React.lazy(() => import('./pages/Preview/Preview.tsx'));
const Signup = React.lazy(() => import('./pages/Signup/Signup.tsx'));
const Login = React.lazy(() => import('./pages/Login/Login.tsx'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<Error />}>
      <Route path="" element={<Home />} />
      <Route path="search" element={<Search />} />
      <Route path="preview/:paperid" element={<Preview />} />
      <Route path="dashboard/:userid" element={<DashBoard />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
