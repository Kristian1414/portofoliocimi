import { useEffect, useRef } from 'react';

// Hand-drawn red panda (the character from the "Red Panda" illustration)
// peeking over an envelope. Pure SVG: a displacement filter makes the lines
// wobble like pencil/charcoal, CSS handles the pop-up, blink, tail wag and
// hearts, and the pupils follow the pointer.

const INK = 'var(--ink)';
const FUR = '#d4784a';
const FUR_DARK = '#b25d36';
const PAW = '#5a3a2e';
const CREAM = '#fffaf2';

const head =
  'M200 62 C238 62 262 82 266 108 L281 115 L267 122 L279 133 L263 136 L268 152 ' +
  'L132 152 L137 136 L121 133 L133 122 L119 115 L134 108 C138 82 162 62 200 62 Z';
const tuft = 'M182 72 L188 52 L197 64 L205 48 L214 72 Z';
const earL = 'M147 88 C137 66 141 46 155 38 C170 46 179 62 178 73 Z';
const earLIn = 'M153 80 C149 66 151 56 157 50 C165 57 170 66 169 73 Z';
const earR = 'M253 88 C263 66 259 46 245 38 C230 46 221 62 222 73 Z';
const earRIn = 'M247 80 C251 66 249 56 243 50 C235 57 230 66 231 73 Z';
const muzzle = 'M177 121 C179 108 221 108 223 121 C225 139 175 139 177 121 Z';
const envelope = 'M72 152 L328 147 L333 316 L67 319 Z';
const flap = 'M72 152 L200 239 L328 147';
const pawL = 'M148 154 C146 142 158 138 166 139 C176 140 181 147 179 155 C177 162 151 163 148 154 Z';
const pawR = 'M252 154 C254 142 242 138 234 139 C224 140 219 147 221 155 C223 162 249 163 252 154 Z';
const heart = 'M0 3 C0 -1 5 -2 6 1.5 C7 -2 12 -1 12 3 C12 7 6 10 6 11 C6 10 0 7 0 3 Z';

// A second, fainter, slightly offset stroke makes the outline look sketched.
function Sketch({ d, fill = 'none', width = 3 }) {
  return (
    <>
      <path d={d} fill={fill} stroke={INK} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke={INK}
        strokeWidth={width * 0.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.35"
        transform="translate(1.6 1.2)"
      />
    </>
  );
}

export default function MailPanda({ href }) {
  const svgRef = useRef(null);
  const pupilsRef = useRef(null);

  // Pupils look toward the pointer.
  useEffect(() => {
    let frame = 0;
    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const svg = svgRef.current;
        const pupils = pupilsRef.current;
        if (!svg || !pupils) return;
        const r = svg.getBoundingClientRect();
        const ex = r.left + (200 / 400) * r.width;
        const ey = r.top + (104 / 340) * r.height;
        const dx = e.clientX - ex;
        const dy = e.clientY - ey;
        const dist = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, dist / 300) * 3.2;
        pupils.setAttribute('transform', `translate(${((dx / dist) * k).toFixed(2)} ${((dy / dist) * k).toFixed(2)})`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <a className="mailpanda reveal" href={href} target="_blank" rel="noreferrer" aria-label="Send a message on Instagram">
      <svg ref={svgRef} viewBox="0 0 400 340" role="img" aria-hidden="true">
        <defs>
          <filter id="mp-sketch" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g filter="url(#mp-sketch)">
          {/* ---- behind the envelope ---- */}
          <g className="mp-rise">
            <g className="mp-tail">
              <path d="M284 190 C330 180 348 146 340 110 C337 96 326 90 318 97" fill="none" stroke={INK} strokeWidth="31" strokeLinecap="round" />
              <path d="M284 190 C330 180 348 146 340 110 C337 96 326 90 318 97" fill="none" stroke={FUR} strokeWidth="25" strokeLinecap="round" />
              <path d="M284 190 C330 180 348 146 340 110 C337 96 326 90 318 97" fill="none" stroke={PAW} strokeWidth="25" strokeDasharray="9 13" strokeDashoffset="-6" opacity="0.75" />
            </g>

            {/* coat, mostly hidden by the envelope */}
            <path d="M138 140 L262 140 L270 240 L130 240 Z" fill="#6b4535" />
            <path d="M170 142 L200 162 L230 142 Z" fill="#f3e3c4" stroke={INK} strokeWidth="2" />

            <g className="mp-ear mp-ear--l">
              <Sketch d={earL} fill={FUR} />
              <path d={earLIn} fill={CREAM} />
            </g>
            <g className="mp-ear mp-ear--r">
              <Sketch d={earR} fill={FUR} />
              <path d={earRIn} fill={CREAM} />
            </g>

            {/* fur tuft sits behind the head outline */}
            <path d={tuft} fill={FUR} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
            <Sketch d={head} fill={FUR} />
            {/* darker fur strokes */}
            <path d="M150 100 L160 104 M146 110 L157 112 M250 100 L240 104 M254 110 L243 112" stroke={FUR_DARK} strokeWidth="2.4" strokeLinecap="round" />

            {/* white face mask */}
            <circle cx="171" cy="86" r="5.5" fill={CREAM} />
            <circle cx="229" cy="86" r="5.5" fill={CREAM} />
            <ellipse cx="177" cy="104" rx="17" ry="13" fill={CREAM} />
            <ellipse cx="223" cy="104" rx="17" ry="13" fill={CREAM} />
            <Sketch d={muzzle} fill={CREAM} width={2.2} />
            {/* tear marks */}
            <path d="M163 114 C160 122 160 130 163 137 M237 114 C240 122 240 130 237 137" fill="none" stroke={PAW} strokeWidth="5" strokeLinecap="round" />
            {/* blush */}
            <ellipse cx="152" cy="126" rx="8" ry="4.5" fill="var(--accent-soft)" opacity="0.9" />
            <ellipse cx="248" cy="126" rx="8" ry="4.5" fill="var(--accent-soft)" opacity="0.9" />

            <g className="mp-eyes">
              <g ref={pupilsRef}>
                <circle cx="177" cy="104" r="6" fill={INK} />
                <circle cx="223" cy="104" r="6" fill={INK} />
                <circle cx="179" cy="102" r="1.8" fill="#fff" />
                <circle cx="225" cy="102" r="1.8" fill="#fff" />
              </g>
            </g>

            <ellipse cx="200" cy="119" rx="7.5" ry="5" fill={INK} />
            <path d="M200 124 L200 128 M193 129 C196 133 200 132 200 128 C200 132 204 133 207 129" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* ---- the envelope ---- */}
          <Sketch d={envelope} fill={CREAM} width={3.6} />
          <Sketch d={flap} width={3.2} />
          <path d="M67 319 L168 232 M333 316 L236 230" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.35" strokeLinecap="round" />
          <g transform="translate(188 226) scale(2)">
            <path d={heart} fill="var(--accent)" stroke={INK} strokeWidth="0.9" />
          </g>

          {/* ---- paws on the edge, in front of the envelope ---- */}
          <g className="mp-rise">
            <Sketch d={pawL} fill={PAW} width={2.6} />
            <Sketch d={pawR} fill={PAW} width={2.6} />
            <path d="M157 150 L156 157 M164 149 L164 157 M171 150 L172 157 M243 150 L244 157 M236 149 L236 157 M229 150 L228 157" stroke={CREAM} strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* hearts that float up on hover */}
          {[
            [96, 150, 0],
            [122, 132, 0.55],
            [292, 150, 1.1],
          ].map(([x, y, delay]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <g className="mp-heart" style={{ animationDelay: `${delay}s` }}>
                <path d={heart} fill="var(--accent)" />
              </g>
            </g>
          ))}
        </g>
      </svg>
      <span className="mailpanda__note">psst… send me a letter!</span>
    </a>
  );
}
