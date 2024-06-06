import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { ThemeProvider } from './hooks/useTheme.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Footer from './components/Footer/Footer.tsx';
import Loading from './pages/Loading/Loading.tsx';
import { SWRConfig } from 'swr';
import fetcher from './utils/fetcher/fetcher.ts';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './hooks/useAuth.tsx';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import { cn } from '@/lib/utils';

export default function Root() {
  const authRegex = /\/auth/;
  const dashboardRegex = /\/dashboard/;
  const currentLocation = useLocation();
  const isAuthPage = authRegex.test(currentLocation.pathname);
  const isDashBoardPage = dashboardRegex.test(currentLocation.pathname);
  const parentClass = isDashBoardPage ? 'grid grid-cols-12' : '';
  const layoutClass = isDashBoardPage ? 'col-span-9' : '';

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <SWRConfig
          value={{
            fetcher,
            shouldRetryOnError: false,
            revalidateOnFocus: false,
          }}
        >
          <main className={cn('box-border min-h-screen', parentClass)}>
            {isDashBoardPage && <Sidebar className="col-span-3" />}
            <div className={layoutClass}>
              {!isAuthPage && <Navbar />}
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
              {!isAuthPage && <Footer />}
            </div>
          </main>
          <Toaster />
        </SWRConfig>
      </AuthProvider>
    </ThemeProvider>
  );
}
