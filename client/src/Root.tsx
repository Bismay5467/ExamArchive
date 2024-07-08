import { SWRConfig } from 'swr';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AuthProvider } from './hooks/useAuth.tsx';
import Footer from './components/Footer/Footer.tsx';
import Loading from './pages/Loading/Loading.tsx';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import { ThemeProvider } from './hooks/useTheme.tsx';
import { Toaster } from '@/components/ui/sonner';
import fetcher from './utils/fetcher/fetcher.ts';
import { SearchProvider } from './hooks/useSearch.tsx';

export default function Root() {
  const authRegex = /\/auth/;
  const currentLocation = useLocation();
  const isAuthPage = authRegex.test(currentLocation.pathname);

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
          <SearchProvider>
            <main className="box-border min-h-screen bg-white">
              <Sidebar />
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
              {!isAuthPage && <Footer />}
            </main>
            <Toaster richColors visibleToasts={9} />
          </SearchProvider>
        </SWRConfig>
      </AuthProvider>
    </ThemeProvider>
  );
}
