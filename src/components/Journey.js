import { useEffect, useRef, useState } from 'react';

const GAP = 62; // vertical distance between stops
const CX = 30; // centre line of the path
const AMP = 20; // how far the path swings left/right
const PAD = 14;
const TURN_AFTER = 80; // px of scrolling the other way before the plane turns round

// One bump of a continuous wave between two stops. Consecutive bumps swing to
// opposite sides and share their tangent at every stop, so the trail (and the
// plane following it) has no corners.
function segment(i) {
  const y0 = PAD + i * GAP;
  const y1 = y0 + GAP;
  const x = CX + (i % 2 === 0 ? AMP : -AMP);
  return `M${CX},${y0} C${x},${y0 + GAP / 3} ${x},${y1 - GAP / 3} ${CX},${y1}`;
}

// Side navigation drawn as a journey: stops joined by a winding dashed
// trail, with a paper plane that flies along it as the page scrolls.
export default function Journey({ links }) {
  const [active, setActive] = useState(0);
  const moveRef = useRef(null);
  const turnRef = useRef(null);
  const segRefs = useRef([]);
  const doneRefs = useRef([]);
  const height = PAD * 2 + (links.length - 1) * GAP;

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let backwards = false;
    let against = 0; // distance scrolled against the current heading
    let shown = null; // unwrapped angle currently applied

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy) {
        const goingUp = dy < 0;
        if (goingUp === backwards) against = 0;
        else {
          against += Math.abs(dy);
          if (against > TURN_AFTER) {
            backwards = goingUp;
            against = 0;
          }
        }
      }

      // Continuous progress: index of current section + fraction through it.
      const probe = window.innerHeight * 0.45;
      const tops = links.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top - probe : 0;
      });
      let i = 0;
      while (i < tops.length - 1 && tops[i + 1] <= 0) i += 1;
      let frac = 0;
      if (i < tops.length - 1) frac = Math.min(1, Math.max(0, -tops[i] / (tops[i + 1] - tops[i])));
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) {
        i = links.length - 1;
        frac = 0;
      }
      setActive(i);

      // Paint the part of the trail already travelled.
      segRefs.current.forEach((seg, k) => {
        const done = doneRefs.current[k];
        if (!seg || !done) return;
        const len = seg.getTotalLength();
        const part = k < i ? len : k === i ? len * frac : 0;
        done.style.strokeDasharray = `${part} ${len}`;
      });

      // Place the plane on the trail and point it along the tangent.
      const seg = segRefs.current[Math.min(i, links.length - 2)];
      if (!seg || !moveRef.current || !turnRef.current) return;
      const len = seg.getTotalLength();
      const at = i >= links.length - 1 ? len : len * frac;
      const p = seg.getPointAtLength(at);
      const a = seg.getPointAtLength(Math.max(0, Math.min(len, at + 2)));
      const b = seg.getPointAtLength(Math.max(0, Math.min(len, at - 2)));
      let target = (Math.atan2(a.y - b.y, a.x - b.x) * 180) / Math.PI;
      if (backwards) target += 180;
      // unwrap so the CSS transition always takes the short way round
      if (shown === null) shown = target;
      else shown += ((((target - shown) % 360) + 540) % 360) - 180;

      moveRef.current.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);
      turnRef.current.style.transform = `rotate(${shown.toFixed(1)}deg) scale(1.25)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [links]);

  return (
    <nav className="journey" aria-label="Sections" style={{ height }}>
      <svg className="journey__svg" width={CX * 2} height={height} viewBox={`0 0 ${CX * 2} ${height}`} aria-hidden="true">
        {links.slice(0, -1).map((l, i) => (
          <g key={l.id}>
            {/* the travelled part keeps its dashes: it is revealed through a mask */}
            <mask id={`journey-mask-${i}`} maskUnits="userSpaceOnUse">
              <path
                ref={(el) => (doneRefs.current[i] = el)}
                d={segment(i)}
                fill="none"
                stroke="#fff"
                strokeWidth="8"
                strokeDasharray="0 999"
              />
            </mask>
            <path ref={(el) => (segRefs.current[i] = el)} d={segment(i)} className="journey__trail" />
            <path d={segment(i)} className="journey__done" mask={`url(#journey-mask-${i})`} />
          </g>
        ))}
      </svg>

      {links.map((l, i) => (
        <a
          key={l.id}
          href={`#${l.id}`}
          className={`journey__stop ${i < active ? 'is-passed' : ''} ${i === active ? 'is-active' : ''}`}
          style={{ top: PAD + i * GAP }}
          aria-label={l.label}
          aria-current={i === active ? 'true' : undefined}
        >
          <span className="journey__label">{l.label}</span>
        </a>
      ))}

      {/* drawn after the stops so the plane flies over them */}
      <svg className="journey__svg journey__svg--plane" width={CX * 2} height={height} viewBox={`0 0 ${CX * 2} ${height}`} aria-hidden="true">
        <g ref={moveRef}>
          <g ref={turnRef} className="journey__plane">
            {/* folded paper plane seen from above, nose pointing along +x */}
            <path className="journey__plane-wing journey__plane-wing--top" d="M15 0 L-12 -11 L-6 0 Z" />
            <path className="journey__plane-wing journey__plane-wing--bottom" d="M15 0 L-6 0 L-12 10 Z" />
            <path className="journey__plane-keel" d="M15 0 L-6 0 L-2 5 Z" />
            <path className="journey__plane-crease" d="M15 0 L-6 0" />
          </g>
        </g>
      </svg>
    </nav>
  );
}
