import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { works } from './data/works';
import useReveal from './hooks/useReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Story from './components/Story';
import Gallery from './components/Gallery';
import Motion from './components/Motion';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';

export default function App() {
  const [viewer, setViewer] = useState(null); // { items, index }
  const [showTop, setShowTop] = useState(false);

  useReveal();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const open = useCallback((id, list = works) => {
    const index = list.findIndex((w) => w.id === id);
    setViewer({ items: list, index: Math.max(index, 0) });
  }, []);

  const close = useCallback(() => setViewer(null), []);

  const navigate = useCallback((dir) => {
    setViewer((v) => v && { ...v, index: (v.index + dir + v.items.length) % v.items.length });
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero onOpen={open} />
        <About onOpen={open} />
        <Story onOpen={open} />
        <Gallery onOpen={open} />
        <Motion onOpen={open} />
        <Contact />
      </main>
      <Footer />

      <button
        className={`to-top ${showTop ? 'is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>

      {viewer && <Lightbox items={viewer.items} index={viewer.index} onClose={close} onNavigate={navigate} />}
    </>
  );
}
