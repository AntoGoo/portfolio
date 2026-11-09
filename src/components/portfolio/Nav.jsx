import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const links = [
  { id: 'profil', label: 'Profil' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'realisations', label: 'Réalisations' },
  { id: 'expertises', label: 'Expertises' },
  { id: 'methode', label: 'Méthode' },
];

export default function Nav({ profile }) {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    [...links, { id: 'contact' }].forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        open ? 'bg-background' : scrolled ? 'bg-background/92 backdrop-blur-md' : 'bg-transparent'
      )}
    >
      <div className="rm-container flex h-[72px] items-center justify-between gap-6">
        <a href="#top" className="flex items-baseline gap-3" aria-label="Retour en haut de page">
          <span className="font-display text-[1.65rem] leading-none">{profile?.initials || 'AG'}</span>
          <span className="hidden font-mono text-[11.5px] uppercase tracking-[0.08em] text-muted-foreground sm:inline">
            {profile?.name}
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={cn(
                'font-mono text-[12px] uppercase tracking-[0.06em] transition-colors duration-200',
                active === link.id ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden h-10 items-center bg-foreground px-5 text-[14px] font-medium text-background transition-colors duration-300 hover:bg-primary sm:inline-flex"
          >
            Me contacter
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="font-mono text-[12px] uppercase tracking-[0.06em] lg:hidden"
          >
            {open ? 'Fermer' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" className="rm-container h-[calc(100dvh-72px)] overflow-y-auto pb-10 lg:hidden">
          <ol className="border-t rm-rule">
            {[...links, { id: 'contact', label: 'Contact' }].map((link, i) => (
              <li key={link.id} className="border-b rm-rule">
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-5 py-5 font-display text-[2.25rem] leading-none"
                >
                  <span className="font-mono text-[12px] text-primary">0{i + 1}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </header>
  );
}
