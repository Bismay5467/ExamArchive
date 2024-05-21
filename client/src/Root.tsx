import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { ThemeProvider } from './hooks/theme-provider.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Footer from './components/Footer/Footer.tsx';
import Loading from './pages/Loading/Loading.tsx';

export default function Root() {
  const authRegex = /\/auth/;
  const currentLocation = useLocation();
  const isAuthPage = authRegex.test(currentLocation.pathname);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="box-border h-screen overflow-y-auto">
        {!isAuthPage && <Navbar />}
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
        {!isAuthPage && <Footer />}
      </div>
    </ThemeProvider>
  );
}
