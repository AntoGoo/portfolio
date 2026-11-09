import { Link } from 'react-router-dom';
import { profile as defaultProfile } from '@/data/portfolioContent';

const links = [
  { id: 'profil', label: 'Profil' },
  { id: 'expertises', label: 'Expertises' },
  { id: 'realisations', label: 'Réalisations' },
  { id: 'methode', label: 'Méthode' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'contact', label: 'Contact' },
];

export default function Footer({ profile = defaultProfile }) {
  return (
    <footer className="border-t border-border/70 bg-muted">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:px-10 md:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card font-heading text-[13px] font-bold tracking-[0.04em]">
                {profile.initials}
              </span>
              <div>
                <p className="font-heading text-[14px] font-medium">{profile.name}</p>
                <p className="text-[11.5px] text-muted-foreground">{profile.role}</p>
              </div>
            </div>
            <p className="mt-6 max-w-xs font-heading text-[13px] leading-relaxed text-muted-foreground">
              {profile.tagline}
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-[11.5px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <p>{profile.location}</p>
            <Link to="/studio" className="text-muted-foreground/70 transition-colors hover:text-foreground">
              Espace privé
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}