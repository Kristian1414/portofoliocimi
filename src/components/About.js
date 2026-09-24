import { artist, byId, works } from '../data/works';

const portrait = byId('CToEFmqJc0f');

export default function About({ onOpen }) {
  const stats = [
    { value: works.filter((w) => w.type === 'illustration').length, label: 'Illustrations' },
    { value: works.filter((w) => w.type === 'animation').length, label: 'Animations' },
    { value: artist.tools.length, label: 'Favourite tools' },
  ];

  return (
    <section id="about" className="about section section--about">
      <div className="container about__inner">
        <button className="about__portrait reveal" onClick={() => onOpen(portrait.id)} aria-label="Open Favorite Sweater">
          <img src={portrait.media} alt="Favorite Sweater illustration" loading="lazy" />
          <span className="about__stamp">since 2020</span>
        </button>

        <div className="about__text">
          <p className="eyebrow reveal">About the illustrator</p>
          <h2 className="section-title reveal">
            Cozy seasons, soft feelings
            <br />& a little bit of <span className="mark">magic</span>.
          </h2>
          <p className="reveal">
            {artist.name} is an illustrator from {artist.location} who draws in the spirit of
            children’s picture books: red pandas gathering autumn leaves, a girl reading with
            friendly ghosts, a tiny guest arriving at a lantern-lit tent.
          </p>
          <p className="reveal">
            Many pieces start in Procreate and come to life as short animations in After Effects
            and Mental Canvas, turning a still page into a moment you can step into.
          </p>

          <ul className="chips reveal">
            {artist.tools.map((t) => (
              <li key={t} className="chip">{t}</li>
            ))}
            <li className="chip chip--ghost">Children’s book art</li>
            <li className="chip chip--ghost">Character design</li>
          </ul>

          <dl className="stats reveal">
            {stats.map((s) => (
              <div key={s.label} className="stats__item">
                <dt>{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
