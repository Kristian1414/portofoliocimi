// Instagram-style "multiple photos" badge: two stacked rounded squares.
export default function CarouselIcon({ className = '' }) {
  return (
    <svg className={`carousel-icon ${className}`} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M8 3h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-1V7a2 2 0 0 0-2-2H6V5a2 2 0 0 1 2-2z" fill="currentColor" />
      <rect x="3" y="6" width="15" height="15" rx="2.5" fill="currentColor" />
    </svg>
  );
}
