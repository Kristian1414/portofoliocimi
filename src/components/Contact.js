import { artist } from '../data/works';
import TornEdge from './TornEdge';
import MailPanda from './MailPanda';

export default function Contact() {
  return (
    <section id="contact" className="contact section section--contact">
      <TornEdge color="var(--bg-motion)" position="top" seed={41} />
      <div className="container contact__inner">
        <div className="contact__art">
          <MailPanda href={`https://ig.me/m/${artist.handle}`} />
        </div>
        <div className="contact__text">
          <p className="eyebrow reveal">Let’s work together</p>
          <h2 className="section-title reveal">
            Have a story that
            <br />
            needs <span className="mark">pictures</span>?
          </h2>
          <p className="reveal">
            Picture books, editorial spots, character design or short animated loops.
            Send a message and let’s make something warm together.
          </p>
          <div className="hero__actions reveal">
            <a className="btn" href={`https://ig.me/m/${artist.handle}`} target="_blank" rel="noreferrer">
              Message on Instagram
            </a>
            {artist.email && (
              <a className="btn btn--ghost" href={`mailto:${artist.email}`}>
                Send an email
              </a>
            )}
          </div>
          <p className="hero__meta reveal">📍 Based in {artist.location}, working worldwide</p>
        </div>
      </div>
    </section>
  );
}
