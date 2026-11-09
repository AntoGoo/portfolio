import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tagStyle } from '@/lib/tagStyle';

const blocks = [
  { key: 'context', label: 'Contexte' },
  { key: 'problem', label: 'Problématique' },
  { key: 'objectives', label: 'Objectifs' },
  { key: 'role', label: 'Rôle et responsabilités' },
  { key: 'methodology', label: 'Méthodologie' },
  { key: 'solutions', label: 'Solutions mises en œuvre' },
  { key: 'results', label: 'Résultats' },
];

export default function ProjectDrawer({ project, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = project ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-border bg-card"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-6 py-4 backdrop-blur md:px-9">
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {project.year || 'Réalisation'}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-8 md:px-9 md:py-10">
              <h3 className="font-heading text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[30px]">
                {project.title}
              </h3>

              <div className="mt-4 flex flex-wrap gap-1.5">
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

              <div className="mt-9 space-y-7">
                {blocks.map((block) =>
                  project[block.key] ? (
                    <div key={block.key}>
                      <h4 className="text-[10px] uppercase tracking-[0.2em] text-primary/85">{block.label}</h4>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/85">{project[block.key]}</p>
                    </div>
                  ) : null
                )}
              </div>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 inline-flex h-[44px] items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {project.link_label || 'Voir le projet'}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}