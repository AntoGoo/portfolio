import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Image } from '@/components/ui/image';
import { tagStyle } from '@/lib/tagStyle';

export default function ProjectCard({ project, featured, onOpen }) {
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card p-6 font-grotesk transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 md:p-7',
        featured && 'md:p-9'
      )}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ouvrir la fiche : ${project.title}`}
        className="absolute inset-0 z-0 cursor-pointer"
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between gap-3">
          {project.year ? (
            <span
              className={cn(
                'rounded-full border px-2.5 py-1 font-grotesk text-[10px] font-medium uppercase tracking-[0.14em]',
                tagStyle(project.year)
              )}
            >
              {project.year}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
          {project.logo_url && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background/40 p-1.5">
              <Image src={project.logo_url} alt="" className="h-full w-full" fittingType="fit" />
            </span>
          )}
        </div>

        <h3
          className={cn(
            'mt-5 font-semibold leading-[1.15] tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary',
            featured ? 'text-[22px] md:text-[24px]' : 'text-[19px]'
          )}
        >
          {project.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-[13px] font-normal leading-[1.55] text-muted-foreground">
          {project.context}
        </p>

        <div className="mt-auto pt-7">
          <div className="flex flex-wrap gap-1.5">
            {(project.tags || []).map((tag) => (
              <span
                key={tag}
                className={cn(
                  'rounded border px-2 py-1 text-[10.5px] uppercase tracking-[0.1em]',
                  tagStyle(tag)
                )}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
            <span className="flex items-center gap-2 text-[12px] font-medium text-foreground/70 transition-colors group-hover:text-foreground">
              Ouvrir la fiche
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
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