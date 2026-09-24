import { useMemo } from 'react';

const shapes = [
  // simple leaf
  'M12 2C6 6 3 12 5 20c7-1 13-6 14-14-2-1-4-3-7-4z',
  // round petal
  'M12 3c5 0 8 4 8 9s-4 9-8 9-8-4-8-9 3-9 8-9z',
  // star sparkle
  'M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z',
];
const colors = ['var(--accent)', 'var(--accent-soft)', 'var(--slate-soft)', 'var(--sky-deep)'];

// Drifting leaves/sparkles, purely decorative.
export default function FloatingLeaves({ count = 8 }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 97) % 100,
        size: 12 + ((i * 37) % 18),
        delay: -((i * 1.7) % 12),
        duration: 12 + ((i * 5) % 10),
        shape: shapes[i % shapes.length],
        color: colors[i % colors.length],
      })),
    [count]
  );

  return (
    <div className="leaves" aria-hidden="true">
      {leaves.map((l, i) => (
        <svg
          key={i}
          className="leaves__item"
          viewBox="0 0 24 24"
          style={{
            left: `${l.left}%`,
            width: l.size,
            height: l.size,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
          }}
        >
          <path d={l.shape} fill={l.color} />
        </svg>
      ))}
    </div>
  );
}
