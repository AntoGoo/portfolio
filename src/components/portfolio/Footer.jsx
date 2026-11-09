import { Link } from 'react-router-dom';
import { profile as defaultProfile } from '@/data/portfolioContent';

export default function Footer({ profile = defaultProfile }) {
  return (
    <footer className="mt-24 md:mt-32">
      <div className="calque-wrap flex flex-col gap-3 border-t-[3px] border-foreground py-6 text-[14px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}, {profile.location}
        </p>
        <Link to="/studio" className="line-link transition-colors hover:text-foreground">
          Espace privé
        </Link>
      </div>
    </footer>
  );
}
