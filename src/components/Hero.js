import { useRef } from 'react';
import { artist, byId } from '../data/works';
import TornEdge from './TornEdge';
import FloatingLeaves from './FloatingLeaves';

const stack = [
  { work: byId('CQsBR2YLh7F'), cls: 'hero__card--a', depth: 18 },
  { work: byId('CWvNAn3p5bT'), cls: 'hero__card--b', depth: 32 },
  { work: byId('CRtjohHrecf'), cls: 'hero__card--c', depth: 24 },
];

export default function Hero({ onOpen }) {
  const artRef = useRef(null);

  // Mouse parallax on the stacked cards (desktop pointers only).
  const onMove = (e) => {
    const el = artRef.current;
    if (!el || e.pointerType === 'touch') return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--mx', x.toFixed(3));
    el.style.setProperty('--my', y.toFixed(3));
  };
  const onLeave = () => {
    const el = artRef.current;
    if (!el) return;
    el.style.setProperty('--mx', 0);
    el.style.setProperty('--my', 0);
  };

  return (
    <section id="home" className="hero" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="blob blob--1" />
      <div className="blob blob--2" />
      <FloatingLeaves count={9} />

      <div className="container hero__inner">
        <div className="hero__text">
          <p className="eyebrow reveal">Hello, I’m {artist.name} ✦ {artist.role}</p>
          <h1 className="hero__title reveal">
            Little stories,
            <br />
            <em>drawn with love.</em>
          </h1>
          <p className="hero__quote reveal">
            <span className="quote-mark">“</span>
            {artist.intro}
            <span className="quote-mark">”</span>
          </p>
          <div className="hero__actions reveal">
            <a href="#works" className="btn">See the works</a>
            <a href="#story" className="btn btn--ghost">Read a story</a>
          </div>
          <p className="hero__meta reveal">📍 {artist.location}</p>
        </div>

        <div className="hero__art" ref={artRef}>
          {stack.map(({ work, cls, depth }) => (
            <button
              key={work.id}
              className={`hero__card ${cls}`}
              style={{ '--depth': depth }}
              onClick={() => onOpen(work.id)}
              aria-label={`Open ${work.title}`}
            >
              <img src={work.media} alt={work.title} />
              <span className="hero__card-label">{work.title}</span>
            </button>
          ))}
          <span className="hero__scribble">my little worlds ↓</span>
        </div>
      </div>

      <TornEdge color="var(--bg-about)" seed={3} />
    </section>
  );
}
