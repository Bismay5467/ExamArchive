import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { ThemeProvider } from './hooks/theme-provider.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Footer from './components/Footer/Footer.tsx';
import Loading from './pages/Loading/Loading.tsx';

export default function Root() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="box-border min-h-screen">
        <Navbar />
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
    </ThemeProvider>
  );
}