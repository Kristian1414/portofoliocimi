import { useMemo, useRef, useState } from 'react';
import { works } from '../data/works';
import useReveal from '../hooks/useReveal';
import CarouselIcon from './CarouselIcon';

const filters = [
  { id: 'all', label: 'All works' },
  { id: 'illustration', label: 'Illustrations' },
  { id: 'animation', label: 'Animations' },
];

function Card({ work, index, onOpen }) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);

  const onEnter = () => videoRef.current && videoRef.current.play().catch(() => {});
  const onLeave = () => {
    if (videoRef.current) videoRef.current.pause();
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rx', 0);
      cardRef.current.style.setProperty('--ry', 0);
    }
  };
  // Gentle 3D tilt that follows the pointer.
  const onMove = (e) => {
    if (e.pointerType === 'touch' || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -6).toFixed(2));
    cardRef.current.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2));
  };

  return (
    <button
      ref={cardRef}
      className={`card card--${work.type} reveal`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
      onClick={() => onOpen(work.id)}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerMove={onMove}
      aria-label={`Open ${work.title}`}
    >
      <div className="card__media" style={{ aspectRatio: work.ratio }}>
        {work.type === 'animation' ? (
          <>
            <video ref={videoRef} src={work.media} poster={work.thumb} muted loop playsInline preload="none" />
            <span className="card__badge">▶ Animation</span>
          </>
        ) : (
          <img src={work.thumb} alt={work.title} loading="lazy" decoding="async" />
        )}
        {work.slides.length > 1 && (
          <span className="card__carousel" title={`${work.slides.length} photos`}>
            <CarouselIcon />
            <span className="visually-hidden">{work.slides.length} photos</span>
          </span>
        )}
      </div>
      <div className="card__body">
        <h3>{work.title}</h3>
        <p>{work.tags.join(' · ')}</p>
      </div>
    </button>
  );
}

export default function Gallery({ onOpen }) {
  const [filter, setFilter] = useState('all');
  const list = useMemo(
    () => (filter === 'all' ? works : works.filter((w) => w.type === filter)),
    [filter]
  );
  useReveal([filter]);

  return (
    <section id="works" className="gallery section section--works">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow reveal">Portfolio</p>
          <h2 className="section-title reveal">Selected <span className="mark">works</span></h2>
          <p className="section-lead reveal">
            Tap any piece to view it larger. Animations play when you hover over them.
          </p>
        </div>

        <div className="filters reveal" role="tablist" aria-label="Filter works">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`filters__btn ${filter === f.id ? 'is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className="filters__count">
                {f.id === 'all' ? works.length : works.filter((w) => w.type === f.id).length}
              </span>
            </button>
          ))}
        </div>

        <div className="masonry" key={filter}>
          {list.map((work, i) => (
            <Card key={work.id} work={work} index={i} onOpen={(id) => onOpen(id, list)} />
          ))}
        </div>
      </div>
    </section>
  );
}
