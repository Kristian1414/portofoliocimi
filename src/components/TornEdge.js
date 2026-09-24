import { useMemo } from 'react';

// Deterministic pseudo-random so the edge looks the same on every render.
function rand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Torn outline as a CSS polygon (percentages of a 1200x60 box).
function buildPolygon(seed, rough) {
  const r = rand(seed);
  const pts = [[0, 60]];
  let x = 0;
  while (x < 1200) {
    pts.push([x, 20 + (r() - 0.5) * rough + Math.sin(x / 90) * 6]);
    x += 8 + r() * 22;
  }
  pts.push([1200, 20], [1200, 60]);
  return `polygon(${pts.map(([px, py]) => `${((px / 1200) * 100).toFixed(2)}% ${((py / 60) * 100).toFixed(2)}%`).join(', ')})`;
}

// Paper-tear divider painted in `color`, placed at the top or bottom of a section.
// It is a clipped div rather than an SVG so it can carry exactly the same canvas
// texture as the section it belongs to, which keeps the seam invisible.
export default function TornEdge({ color = 'var(--paper)', position = 'bottom', seed = 7, rough = 22, textured = true }) {
  const clipPath = useMemo(() => buildPolygon(seed, rough), [seed, rough]);
  return (
    <div
      className={`torn torn--${position} ${textured ? 'textured' : ''}`}
      style={{ backgroundColor: color, clipPath, WebkitClipPath: clipPath }}
      aria-hidden="true"
    />
  );
}
