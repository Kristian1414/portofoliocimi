import { artist } from '../data/works';
import TornEdge from './TornEdge';

export default function Footer() {
  return (
    <footer className="footer">
      <TornEdge color="var(--bg-footer)" position="top" seed={51} rough={14} textured={false} />
      <div className="container footer__inner">
        <a href="#home" className="nav__logo nav__logo--light">
          <img className="nav__logo-img" src={`${process.env.PUBLIC_URL}/logo.png`} alt="" width="42" height="42" />
          <span>{artist.handle}</span>
        </a>
        <nav className="footer__links" aria-label="Footer">
          <a href="#about">About</a>
          <a href="#works">Works</a>
          <a href="#motion">Motion</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="footer__ig" href={artist.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
          </svg>
          @{artist.handle}
        </a>
      </div>
      <p className="footer__copy">
        © {new Date().getFullYear()} {artist.name}. All illustrations belong to the artist.
      </p>
    </footer>
  );
}
