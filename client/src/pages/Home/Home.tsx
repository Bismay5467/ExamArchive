import { useEffect } from 'react';
import AOS from 'aos';
import Header from './Header/Header';
import Hero from './Hero/Hero';
import './Home.css';
import PageIllustration from './PageIllustration/PageIllustration';
import 'aos/dist/aos.css';
import Features from './Features/Features';
import Zigzag from './Zigzag/Zigzag';
import Testimonials from './Testimonials/Testimonials';
import Newsletter from './Newsletter/Newsletter';

export default function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 600,
      easing: 'ease-out-sine',
    });
  });
  return (
    <div className="min-h-screen overflow-hidden antialiased bg-gray-900 text-gray-200 tracking-tight">
      <PageIllustration />
      <div className="flex flex-col">
        <Header />
        <Hero />
        <Features />
        <Zigzag />
        <Testimonials />
        <Newsletter />
      </div>
    </div>
  );
}
