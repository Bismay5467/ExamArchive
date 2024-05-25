import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { ThemeProvider } from './hooks/theme-provider.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Footer from './components/Footer/Footer.tsx';
import Loading from './pages/Loading/Loading.tsx';
import { SWRConfig } from 'swr';
import fetcher from './utils/swr/fetcher.ts';

export default function Root() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SWRConfig value={{ fetcher }}>
        <main className="box-border min-h-screen">
          <Navbar />
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
          <Footer />
        </main>
      </SWRConfig>
    </ThemeProvider>
  );
}
