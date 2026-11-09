import { ExternalLink } from 'lucide-react';

// Ligne de l'index des réalisations. Toute la ligne ouvre la fiche ;
// le lien externe éventuel reste cliquable au-dessus.
export default function ProjectCard({ project, onOpen, onPreview }) {
  return (
    <article
      className="index-row grid grid-cols-12 items-baseline gap-x-4 gap-y-1 border-b border-border py-5 md:py-6"
      onMouseEnter={() => onPreview?.(project)}
      onMouseLeave={() => onPreview?.(null)}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ouvrir la fiche : ${project.title}`}
        className="absolute inset-0 z-0 cursor-pointer"
      />
      <span className="pointer-events-none relative col-span-12 text-[14px] text-muted-foreground md:col-span-2">
        {project.year}
      </span>
      <h3 className="index-title pointer-events-none relative col-span-12 text-[1.35rem] font-semibold leading-tight tracking-[-0.025em] md:col-span-6 md:text-[1.8rem]">
        {project.title}
      </h3>
      <span className="pointer-events-none relative hidden text-[14px] text-muted-foreground md:col-span-3 md:block">
        {(project.tags || []).join(', ')}
      </span>
      <span className="relative col-span-12 md:col-span-1 md:text-right">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={project.link_label || 'Ouvrir le lien du projet'}
            className="relative z-10 inline-flex h-9 w-9 items-center justify-center border border-border transition-colors hover:border-primary hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </span>
    </article>
  );
}
