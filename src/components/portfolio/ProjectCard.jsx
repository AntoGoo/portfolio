import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import TagDot from '@/components/portfolio/TagDot';
import { formatProjectDate } from '@/lib/projectDate';

export default function ProjectCard({ project, featured }) {
  const category = (project.year || '').trim();
  // La catégorie est déjà affichée en haut de la carte : pas de doublon dans les tags.
  const tags = (project.tags || []).filter((tag) => tag.trim().toLowerCase() !== category.toLowerCase());
  // Pas de champ client : on prend ce qui suit le tiret du titre (« Projet GED — Dalkia »).
  const client = project.title?.split(' — ').pop()?.trim() || 'Logo client';
  const period = formatProjectDate(project.start_date, project.end_date);

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-6 font-grotesk transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 md:p-7',
        featured && 'md:p-9'
      )}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Ouverture de la fiche désactivée temporairement, cf. ProjectDrawer pour réactiver. */}

      <div className="pointer-events-none relative z-10 flex h-full flex-col">
        <div className="flex min-h-9 items-start justify-between gap-4">
          {category ? (
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-foreground/80">
              <TagDot tag={category} size={7} />
              {category}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
          {project.logo_url && (
            // Logo déjà normalisé en blanc sur fond transparent à l'import (normalizeLogo) :
            // aucun filtre de couleur à appliquer ici.
            <img
              src={project.logo_url}
              alt={client}
              loading="lazy"
              className="h-9 w-auto max-w-[96px] shrink-0 object-contain object-right-top sm:max-w-[110px]"
            />
          )}
        </div>

        <h3
          className={cn(
            'mt-5 font-semibold leading-[1.15] tracking-[-0.02em] text-foreground',
            featured ? 'text-[22px] md:text-[24px]' : 'text-[19px]'
          )}
        >
          {project.title}
        </h3>
        {/* Police des dates de Parcours. */}
        {period && <p className="font-label mt-2 text-[12px] font-normal text-muted-foreground">{period}</p>}

        <p className="mt-3 line-clamp-3 text-[13px] font-normal leading-[1.55] text-muted-foreground">
          {project.context}
        </p>

        <div className="mt-auto pt-7">
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-x-[14px] gap-y-2">
              {tags.map((tag) => (
                <li key={tag} className="flex items-center gap-[6px] text-[10.5px] uppercase tracking-[0.1em] text-foreground/75">
                  <TagDot tag={tag} size={5} />
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex items-center justify-end border-t border-border/70 pt-4">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                aria-label={project.link_label || 'Ouvrir le lien du projet'}
                className="pointer-events-auto relative z-20 flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}