import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { id: 'profil', label: 'Profil' },
  { id: 'expertises', label: 'Expertises' },
  { id: 'realisations', label: 'Réalisations' },
  { id: 'references', label: 'Références' },
  { id: 'methode', label: 'Méthode' },
  { id: 'parcours', label: 'Parcours' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav({ profile }) {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground bg-background/95 backdrop-blur-sm">
      <div className="calque-wrap flex h-[68px] items-center justify-between gap-6">
        <a href="#top" className="text-[15px] font-semibold tracking-[-0.01em]">
          {profile?.name || 'Anthony Gouvrillon'}
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? 'true' : undefined}
              className={cn(
                'line-link text-[14px] font-medium transition-colors',
                active === link.id ? 'text-foreground [background-size:100%_2px]' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Fermer la navigation' : 'Ouvrir la navigation'}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center border border-foreground lg:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-foreground bg-background lg:hidden">
          <nav className="calque-wrap flex flex-col">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-[17px] font-semibold last:border-none"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
