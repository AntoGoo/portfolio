import { Link } from 'react-router-dom';
import { profile as defaultProfile } from '@/data/portfolioContent';

export default function Footer({ profile = defaultProfile }) {
  return (
    <footer className="bg-foreground text-background">
      <div className="rm-container">
        <div className="flex flex-col gap-3 border-t border-background/20 py-7 font-mono text-[12px] text-background/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name} — {profile.role}, {profile.location}
          </p>
          <div className="flex items-center gap-6">
            <a href="#top" className="transition-colors hover:text-background">
              Haut de page ↑
            </a>
            <Link to="/studio" className="transition-colors hover:text-background">
              Espace privé
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
