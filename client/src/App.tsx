import { ThemeProvider } from './hooks/theme-provider.tsx';
import Navbar from './components/Navbar/Navbar.tsx';
import Home from './pages/Home/Home.tsx';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="box-border h-screen">
        <Navbar />
        <Home />
      </div>
    </ThemeProvider>
  );
}

export default App;
