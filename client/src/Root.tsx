import { SWRConfig } from 'swr';
import { Suspense, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

import { AuthProvider } from './hooks/useAuth.tsx';
import Loading from './pages/Loading/Loading.tsx';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import { ThemeProvider } from './hooks/useTheme.tsx';
import { Toaster } from '@/components/ui/sonner';
import fetcher from './utils/fetcher/fetcher.ts';
import { SearchProvider } from './hooks/useSearch.tsx';
import { CLIENT_ROUTES } from './constants/routes.ts';

export default function Root() {
  const [progress, setProgress] = useState<number>(0);
  const { pathname } = useLocation();
  const showSidebar = !(
    pathname === CLIENT_ROUTES.HOME || pathname.startsWith(CLIENT_ROUTES.AUTH)
  );

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
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
              <LoadingBar
                color="red"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
              />
              <Suspense fallback={<Loading setProgress={setProgress} />}>
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
