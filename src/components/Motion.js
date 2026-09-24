import { useEffect, useRef, useState } from 'react';
import { works } from '../data/works';
import TornEdge from './TornEdge';

const animations = works.filter((w) => w.type === 'animation');
const N = animations.length;
// widest piece: the arrows are placed against it so they never move
const RMAX = Math.max(...animations.map((a) => a.ratio));

// Position of item i relative to the active one, wrapped into [-N/2, N/2).
function offsetOf(i, active) {
  return ((((i - active) % N) + N + Math.floor(N / 2)) % N) - Math.floor(N / 2);
}

// Carousel "stage": the active animation sits in the middle, its neighbours
// peek at the sides, and it wraps round so both sides are always filled.
export default function Motion({ onOpen }) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);
  const videoRefs = useRef([]);
  const prevOffsets = useRef(animations.map((_, i) => offsetOf(i, 0)));
  const touch = useRef(null);

  const go = (dir) => setActive((a) => (a + dir + N) % N);

  // Only the active animation plays, and only while the section is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (inView && i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, inView]);

  // An item that wraps from one side to the other jumps without animating,
  // so it never slides across the middle.
  const offsets = animations.map((_, i) => offsetOf(i, active));
  const jumps = offsets.map((o, i) => Math.abs(o - prevOffsets.current[i]) > 1);
  useEffect(() => {
    prevOffsets.current = offsets;
  });

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };
  const onTouchStart = (e) => {
    touch.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touch.current === null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  const current = animations[active];

  return (
    <section id="motion" ref={sectionRef} className="motion section section--motion">
      <TornEdge color="var(--bg-works)" position="top" seed={31} />
      <div className="container">
        <div className="section-head section-head--motion">
          <p className="eyebrow reveal">Motion</p>
          <h2 className="section-title reveal">Illustrations that <span className="mark">move</span></h2>
          <p className="section-lead reveal">Drawn in Procreate, brought to life in After Effects &amp; Mental Canvas.</p>
        </div>

        <div
          className="stage reveal"
          role="region"
          aria-roledescription="carousel"
          aria-label="Animations"
          style={{ '--ra': current.ratio, '--rmax': RMAX }}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {animations.map((a, i) => {
            const off = offsets[i];
            return (
              <figure
                key={a.id}
                className={`stage__item ${off === 0 ? 'is-active' : ''} ${Math.abs(off) > 1 ? 'is-hidden' : ''} ${jumps[i] ? 'no-anim' : ''}`}
                style={{ '--off': off, '--r': a.ratio }}
                aria-hidden={off !== 0}
              >
                <button
                  className="stage__frame"
                  onClick={() => (off === 0 ? onOpen(a.id) : go(off))}
                  aria-label={off === 0 ? `Open ${a.title}` : `Show ${a.title}`}
                  tabIndex={off === 0 ? 0 : -1}
                >
                  <video ref={(el) => (videoRefs.current[i] = el)} src={a.media} poster={a.poster} muted loop playsInline preload="metadata" />
                </button>
              </figure>
            );
          })}

          <button className="round-btn stage__arrow stage__arrow--prev" onClick={() => go(-1)} aria-label="Previous animation">
            ←
          </button>
          <button className="round-btn stage__arrow stage__arrow--next" onClick={() => go(1)} aria-label="Next animation">
            →
          </button>
        </div>

        <div className="stage__caption" aria-live="polite">
          <span className="motion__num">0{active + 1}</span>
          <div>
            <strong>{current.title}</strong>
            <small>{(current.tools || current.tags).join(' · ')}</small>
          </div>
          <span className="motion__count">
            {active + 1} / {N}
          </span>
        </div>
      </div>
    </section>
  );
}
