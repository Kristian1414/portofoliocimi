import { useEffect, useRef, useState } from 'react';
import CarouselIcon from './CarouselIcon';

const formatDate = (iso) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
function slideSummary(slides) {
  const videos = slides.filter((s) => s.type === 'video').length;
  const photos = slides.length - videos;
  return [photos && plural(photos, 'photo'), videos && plural(videos, 'video')].filter(Boolean).join(' · ');
}

// One post's media, Instagram style: several slides with arrows, dots and swipe.
function PostMedia({ work }) {
  const [slide, setSlide] = useState(0);
  const touchX = useRef(null);
  const videoRefs = useRef([]);
  const slides = work.slides;
  const many = slides.length > 1;
  const go = (dir) => setSlide((s) => Math.min(slides.length - 1, Math.max(0, s + dir)));

  // only the slide on screen plays
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === slide) v.play().catch(() => {});
      else v.pause();
    });
  }, [slide]);

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (!many || touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    const dir = dx < 0 ? 1 : -1;
    // swipes inside the photo move between its slides; at either end they
    // fall through to the lightbox and move to the next/previous post
    if (Math.abs(dx) > 50 && slide + dir >= 0 && slide + dir < slides.length) {
      e.stopPropagation();
      go(dir);
    }
  };

  return (
    <div className="post" style={{ '--r': work.ratio }}>
      <div className="post-media" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="post-media__track" style={{ transform: `translateX(${-slide * 100}%)` }}>
          {slides.map((s, i) => (
            <div className="post-media__slide" key={s.src} aria-hidden={i !== slide}>
              {s.type === 'video' ? (
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={s.src}
                  poster={s.poster}
                  controls
                  loop
                  playsInline
                />
              ) : (
                <img src={s.src} alt={`${work.title}${many ? `, ${i + 1} of ${slides.length}` : ''}`} />
              )}
            </div>
          ))}
        </div>

        {many && (
          <>
            <CarouselIcon className="post-media__badge" />
            {slide > 0 && (
              <button
                className="post-media__arrow post-media__arrow--prev"
                onClick={() => go(-1)}
                aria-label="Previous photo"
              >
                ‹
              </button>
            )}
            {slide < slides.length - 1 && (
              <button
                className="post-media__arrow post-media__arrow--next"
                onClick={() => go(1)}
                aria-label="Next photo"
              >
                ›
              </button>
            )}
          </>
        )}
      </div>
      {many && (
        <div className="post-media__dots" role="tablist" aria-label="Photos in this post">
          {slides.map((s, i) => (
            <button
              key={s.src}
              role="tab"
              aria-selected={i === slide}
              aria-label={`Photo ${i + 1}`}
              className={i === slide ? 'is-active' : ''}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Fullscreen viewer: arrow keys / swipe to move between posts, Esc to close.
export default function Lightbox({ items, index, onClose, onNavigate }) {
  const work = items[index];
  const touchX = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    if (closeRef.current) closeRef.current.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNavigate]);

  if (!work) return null;

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) onNavigate(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button ref={closeRef} className="lightbox__close" onClick={onClose} aria-label="Close">
        ×
      </button>
      {items.length > 1 && (
        <>
          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={() => onNavigate(-1)}
            aria-label="Previous post"
          >
            ‹
          </button>
          <button className="lightbox__nav lightbox__nav--next" onClick={() => onNavigate(1)} aria-label="Next post">
            ›
          </button>
        </>
      )}

      <div className="lightbox__content" key={work.id}>
        <div className="lightbox__media">
          <PostMedia work={work} />
        </div>
        <aside className="lightbox__info">
          <p className="eyebrow">
            {work.type === 'animation' ? 'Animation' : 'Illustration'}
            {work.slides.length > 1 && ` · ${slideSummary(work.slides)}`}
          </p>
          <h3>{work.title}</h3>
          {work.date && (
            <time className="lightbox__date" dateTime={work.date}>
              {formatDate(work.date)}
            </time>
          )}
          <p>{work.caption}</p>
          <ul className="chips">
            {work.tags.map((t) => (
              <li key={t} className="chip chip--ghost">
                {t}
              </li>
            ))}
          </ul>
          <p className="lightbox__count">
            {index + 1} / {items.length}
          </p>
        </aside>
      </div>
    </div>
  );
}
