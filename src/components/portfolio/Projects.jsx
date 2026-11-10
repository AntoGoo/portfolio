import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectDrawer from '@/components/portfolio/ProjectDrawer';
import TagDot from '@/components/portfolio/TagDot';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

// Au-delà de ce nombre de projets visibles, la grille devient un carrousel.
const GRID_MAX = 6;

// Cartes par page du carrousel : 3 × 2 en lg, 2 × 2 en sm, une seule en mobile.
const BREAKPOINTS = ['(min-width: 1024px)', '(min-width: 640px)'];
const readPageSize = () => {
  const [lg, sm] = BREAKPOINTS.map((query) => window.matchMedia(query).matches);
  return lg ? 6 : sm ? 4 : 1;
};

function usePageSize() {
  const [pageSize, setPageSize] = useState(readPageSize);
  useEffect(() => {
    const lists = BREAKPOINTS.map((query) => window.matchMedia(query));
    const onChange = () => setPageSize(readPageSize());
    lists.forEach((mql) => mql.addEventListener('change', onChange));
    return () => lists.forEach((mql) => mql.removeEventListener('change', onChange));
  }, []);
  return pageSize;
}

function useCarouselState(api) {
  const [state, setState] = useState({ index: 0, canPrev: false, canNext: false });
  useEffect(() => {
    if (!api) return undefined;
    const sync = () =>
      setState({ index: api.selectedScrollSnap(), canPrev: api.canScrollPrev(), canNext: api.canScrollNext() });
    sync();
    api.on('select', sync).on('reInit', sync);
    return () => {
      api.off('select', sync).off('reInit', sync);
    };
  }, [api]);
  return state;
}

const pad = (n) => String(n).padStart(2, '0');

const arrowClass =
  'flex h-11 w-11 items-center justify-center rounded-[6px] border border-border text-foreground transition-colors enabled:hover:border-primary enabled:hover:text-primary disabled:opacity-40';

export default function Projects({ projects }) {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState(null);
  const [carouselApi, setCarouselApi] = useState(null);
  const pageSize = usePageSize();
  const reduceMotion = useReducedMotion();
  const list = projects || [];

  const types = useMemo(() => {
    const seen = new Map();
    list.forEach((project) => {
      const type = (project.year || '').trim();
      if (!type) return;
      seen.set(type.toLowerCase(), type);
    });
    return [...seen.values()].sort((a, b) => a.localeCompare(b, 'fr'));
  }, [list]);

  const visible = filter
    ? list.filter((project) => (project.year || '').trim().toLowerCase() === filter.toLowerCase())
    : list;
  const isCarousel = visible.length > GRID_MAX;

  // Une page par slide ; saut direct si le mouvement est réduit.
  const carouselOpts = useMemo(() => ({ align: 'start', duration: reduceMotion ? 0 : 25 }), [reduceMotion]);
  const pages = useMemo(() => {
    const out = [];
    for (let i = 0; i < visible.length; i += pageSize) out.push(visible.slice(i, i + pageSize));
    return out;
  }, [visible, pageSize]);
  const { index, canPrev, canNext } = useCarouselState(isCarousel ? carouselApi : null);
  // Borné : au changement de taille de page, l'ancien index peut survivre un instant.
  const first = Math.min(index * pageSize, Math.max(0, visible.length - 1));
  const last = Math.min(first + pageSize, visible.length);
  const counter = `${pad(first + 1)}${last > first + 1 ? `–${pad(last)}` : ''} / ${pad(visible.length)}`;

  const chooseFilter = (type) => {
    setFilter(type);
    // Le carrousel est remonté (key) : il repart du début avec une nouvelle instance.
    setCarouselApi(null);
  };

  return (
    <Section
      id="realisations"
      index="03"
      eyebrow="Réalisations"
      title="Des projets pilotés de bout en bout"
    >
      {projects === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[260px] animate-pulse rounded-xl border border-border bg-card/60"
              style={{ animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Les réalisations seront publiées prochainement.</p>
      ) : (
        <div className="space-y-8">
          {(types.length > 0 || isCarousel) && (
            // Flèches sur la ligne des filtres en lg ; en dessous, sous le filet, à droite.
            <div className="lg:flex lg:items-end lg:justify-between lg:gap-6 lg:border-b lg:border-border">
              {types.length > 0 && (
                <div className="flex flex-wrap gap-x-2 border-b border-border font-grotesk lg:border-0">
                  {[null, ...types].map((type) => {
                    const isActive = filter === type;
                    return (
                      <button
                        key={type || 'all'}
                        type="button"
                        onClick={() => chooseFilter(type)}
                        aria-pressed={isActive}
                        className={cn(
                          '-mb-px flex min-h-[44px] items-center gap-2 border-b-2 px-3.5 text-[14px] transition-colors',
                          isActive
                            ? 'border-foreground font-semibold text-foreground'
                            : 'border-transparent font-medium text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {type ? (
                          <TagDot tag={type} size={7} className={isActive ? undefined : 'opacity-35'} />
                        ) : (
                          <span
                            aria-hidden="true"
                            className={cn(
                              'h-[7px] w-[7px] shrink-0',
                              isActive ? 'bg-foreground' : 'border border-muted-foreground'
                            )}
                          />
                        )}
                        {type || 'Tous'}
                      </button>
                    );
                  })}
                </div>
              )}

              {isCarousel && (
                <div className="mt-4 flex shrink-0 items-center justify-end gap-3 lg:mt-0 lg:pb-2">
                  <p aria-live="polite" className="font-label text-[13px] font-normal tabular-nums text-muted-foreground">
                    {counter}
                  </p>
                  <button
                    type="button"
                    onClick={() => carouselApi?.scrollPrev()}
                    disabled={!canPrev}
                    aria-label="Projets précédents"
                    className={arrowClass}
                  >
                    <ChevronLeft className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => carouselApi?.scrollNext()}
                    disabled={!canNext}
                    aria-label="Projets suivants"
                    className={arrowClass}
                  >
                    <ChevronRight className="h-[18px] w-[18px]" />
                  </button>
                </div>
              )}
            </div>
          )}

          {visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune réalisation pour ce filtre.</p>
          ) : isCarousel ? (
            <Reveal>
              {/* Les flèches clavier sont gérées par Carousel, tant que le focus est dedans.
                  Un glisser ne déclenche pas le clic d'une carte (Embla l'annule). */}
              {/* Remonté quand le filtre ou la taille de page change : retour à la première page. */}
              <Carousel
                key={`${filter || 'all'}-${pageSize}`}
                opts={carouselOpts}
                setApi={setCarouselApi}
                aria-label="Réalisations"
                className="-mt-0.5"
              >
                <CarouselContent className="pt-0.5">
                  {pages.map((page, i) => (
                    <CarouselItem key={page[0].id} aria-label={`Page ${i + 1} sur ${pages.length}`}>
                      {/* content-start : une page plus courte que la plus haute garde ses cartes à leur hauteur. */}
                      <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {page.map((project) => (
                          <ProjectCard key={project.id} project={project} onOpen={() => setActive(project)} />
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </Reveal>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((project, i) => (
                <Reveal key={project.id} delay={0.04 * i}>
                  <ProjectCard project={project} onOpen={() => setActive(project)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      )}

      <ProjectDrawer project={active} onClose={() => setActive(null)} />
    </Section>
  );
}
