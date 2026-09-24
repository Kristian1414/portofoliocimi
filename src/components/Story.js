import { useEffect, useRef } from 'react';
import { byId } from '../data/works';
import TornEdge from './TornEdge';

const dreamer = byId('CSwjRFaJqaL');

// Night-sky feature for "A Dreamer": the letter lines appear as you scroll.
export default function Story({ onOpen }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.3 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <section id="story" className="story section">
      <TornEdge color="var(--bg-about)" position="top" seed={11} />
      <div className="stars" aria-hidden="true" />
      <div className="moon" aria-hidden="true" />

      <div className="container story__inner">
        <div className="story__media reveal">
          <div className="screen">
            <video
              style={{ aspectRatio: dreamer.ratio }}
              ref={videoRef}
              src={dreamer.media}
              poster={dreamer.poster}
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
          <button className="btn btn--light story__open" onClick={() => onOpen(dreamer.id)}>
            ▶ Watch with sound
          </button>
        </div>

        <div className="story__text">
          <p className="eyebrow eyebrow--light reveal">Featured story · Animation</p>
          <h2 className="section-title section-title--light reveal">
            • A Dreamer •
          </h2>
          <div className="letter">
            {dreamer.letter.map((line, i) => (
              <p
                key={i}
                className={`letter__line reveal ${i === 0 || i === dreamer.letter.length - 1 ? 'letter__line--hand' : ''}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
      <TornEdge color="var(--bg-works)" seed={21} />
    </section>
  );
}
