import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { id: 'profil', label: 'Profil' },
  { id: 'expertises', label: 'Expertises' },
  { id: 'realisations', label: 'Réalisations' },
  { id: 'methode', label: 'Méthode' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav() {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled ? 'border-border/80 bg-background/90 backdrop-blur-md' : 'border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-[1200px] items-center justify-between px-6 md:px-10">
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={cn(
                'relative text-[13px] font-medium tracking-[0.01em] transition-colors',
                active === link.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {active === link.id && (
                // Hors du flux (dans l'espace entre les liens) : le menu ne bouge pas au défilement.
                <span aria-hidden="true" className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-[2px] bg-accent2" />
              )}
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href="#contact"
            className="hidden h-[42px] items-center rounded-md border border-primary/50 px-5 text-[13px] font-medium text-primary transition-all hover:border-primary hover:bg-primary/10 sm:flex"
          >
            Me contacter
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Ouvrir la navigation"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/60 lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/80 bg-background/98 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex w-full max-w-[1200px] flex-col px-6 py-2 md:px-10">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 border-b border-border/60 py-4 text-sm font-medium text-foreground last:border-none"
              >
                {active === link.id && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-[2px] bg-accent2" />}
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}