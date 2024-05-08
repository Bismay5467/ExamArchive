import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
} from 'react-router-dom';

import './index.css';
import Root from './Root';
import {
  Home,
  DashBoard,
  Login,
  Search,
  Preview,
  Signup,
  Error,
} from './pages';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<Error />}>
      <Route path="" element={<Home />} />
      <Route path="search/:query" element={<Search />} />
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
