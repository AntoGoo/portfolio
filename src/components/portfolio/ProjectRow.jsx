import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tagStyle } from '@/lib/tagStyle';

// Ligne de la liste des réalisations. Toute la ligne ouvre la fiche ;
// le lien externe éventuel reste cliquable au-dessus.
export default function ProjectRow({ project, onOpen, onPreview }) {
  return (
    <li
      className="group relative border-b border-border/70 transition-colors duration-300 last:border-none hover:bg-primary/[0.04]"
      onMouseEnter={() => onPreview?.(project)}
      onMouseLeave={() => onPreview?.(null)}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-px bg-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ouvrir la fiche : ${project.title}`}
        className="absolute inset-0 z-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      />

      <div className="pointer-events-none relative z-10 grid grid-cols-12 items-center gap-x-4 gap-y-3 px-5 py-5 md:px-7 md:py-6">
        <div className="col-span-10 md:col-span-2">
          {project.year && (
            <span
              className={cn(
                'inline-block rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]',
                tagStyle(project.year)
              )}
            >
              {project.year}
            </span>
          )}
        </div>

        <div className="col-span-2 flex items-center justify-end gap-2 md:order-last md:col-span-1">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={project.link_label || 'Ouvrir le lien du projet'}
              className="pointer-events-auto relative z-20 flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none" />
        </div>

        <div className="col-span-12 md:col-span-6">
          <h3 className="font-heading text-[18px] font-semibold leading-snug tracking-[-0.015em] text-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary motion-reduce:transition-none md:text-[20px]">
            {project.title}
          </h3>
          {project.context && (
            <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground md:line-clamp-1">
              {project.context}
            </p>
          )}
        </div>

        <div className="hidden flex-wrap gap-1.5 md:col-span-3 md:flex">
          {(project.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={cn('rounded border px-2 py-1 text-[10.5px] uppercase tracking-[0.1em]', tagStyle(tag))}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}
