import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { ThemeProvider } from './hooks/theme-provider.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Footer from './components/Footer/Footer.tsx';
import Loading from './pages/Loading/Loading.tsx';
import { SWRConfig } from 'swr';
import fetcher from './utils/fetcher/fetcher.ts';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './hooks/useAuth.tsx';

export default function Root() {
  const authRegex = /\/auth/;
  const currentLocation = useLocation();
  const isAuthPage = authRegex.test(currentLocation.pathname);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <SWRConfig value={{ fetcher }}>
          <main className="box-border min-h-screen">
            {!isAuthPage && <Navbar />}
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
            {!isAuthPage && <Footer />}
          </main>
          <Toaster />
        </SWRConfig>
      </AuthProvider>
    </ThemeProvider>
  );
}
