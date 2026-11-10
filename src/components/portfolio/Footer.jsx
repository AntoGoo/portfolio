import { navLinks, profile as defaultProfile } from '@/data/portfolioContent';

// Contact est la section juste au-dessus du footer : pas de lien vers elle.
const links = navLinks.filter((link) => link.id !== 'contact');

export default function Footer({ profile = defaultProfile }) {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto grid w-full max-w-[1200px] gap-5 px-6 py-8 text-[13px] text-muted-foreground md:px-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
        <p>
          <span className="font-heading font-semibold text-foreground">{profile.name}</span> · {profile.role}
        </p>

        <nav className="flex flex-wrap gap-x-[22px] gap-y-2">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} className="transition-colors hover:text-foreground">
              {link.label}
            </a>
          ))}
        </nav>

        <p className="lg:text-right">
          © {new Date().getFullYear()} ·{' '}
          <a href="#top" className="transition-colors hover:text-foreground">
            Haut de page ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
