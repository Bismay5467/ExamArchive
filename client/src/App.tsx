import { ThemeProvider } from './components/theme-provider';
import Navbar from './components/Navbar/Navbar';
import HeroBanner from './pages/Home/HeroBanner';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="box-border h-screen">
        <Navbar />
        <HeroBanner />
      </div>
    </ThemeProvider>
  );
}

export default App;
