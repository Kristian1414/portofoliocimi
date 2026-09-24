import { useEffect } from 'react';

// Adds `is-offscreen` to every page section that is out of view, so the CSS
// can pause its looping decorative animations instead of running them unseen.
export default function usePauseOffscreen() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-offscreen', !entry.isIntersecting));
    });
    document.querySelectorAll('main > section').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
