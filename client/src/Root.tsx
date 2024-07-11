import { SWRConfig } from 'swr';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { AuthProvider } from './hooks/useAuth.tsx';
import Loading from './pages/Loading/Loading.tsx';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import { ThemeProvider } from './hooks/useTheme.tsx';
import { Toaster } from '@/components/ui/sonner';
import fetcher from './utils/fetcher/fetcher.ts';
import { SearchProvider } from './hooks/useSearch.tsx';
import { CLIENT_ROUTES } from './constants/routes.ts';

export default function Root() {
  const currentLocation = useLocation();
  const showSidebar = !(
    currentLocation.pathname === CLIENT_ROUTES.HOME ||
    currentLocation.pathname.startsWith(CLIENT_ROUTES.AUTH)
  );

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
            <main className="box-border min-h-screen">
              {showSidebar && <Sidebar />}
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </main>
            <Toaster richColors visibleToasts={9} />
          </SearchProvider>
        </SWRConfig>
      </AuthProvider>
    </ThemeProvider>
  );
}
