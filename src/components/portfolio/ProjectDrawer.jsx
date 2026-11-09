import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';

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
            className="absolute inset-0 bg-foreground/35 backdrop-blur-[2px]"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-background"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b rm-rule bg-background/95 px-6 py-4 backdrop-blur md:px-10">
              <span className="rm-label">
                {project.year || 'Réalisation'}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="flex h-10 w-10 items-center justify-center border rm-rule transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-10 md:px-10 md:py-12">
              <h3 className="rm-display text-[clamp(2.2rem,4vw,3.25rem)] leading-[1.02]">
                {project.title}
              </h3>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
                {(project.tags || []).map((tag) => (
                  <span key={tag} className="font-mono text-[12px] uppercase tracking-[0.06em] text-primary">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-10 border-t border-foreground/80">
                {blocks.map((block) =>
                  project[block.key] ? (
                    <div key={block.key} className="grid gap-2 border-b rm-rule py-6 sm:grid-cols-[11rem_1fr] sm:gap-6">
                      <h4 className="rm-label pt-0.5">{block.label}</h4>
                      <p className="text-[16px] leading-[1.6] text-foreground/85">{project[block.key]}</p>
                    </div>
                  ) : null
                )}
              </div>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 inline-flex h-12 items-center gap-2 bg-foreground px-6 text-[15px] font-medium text-background transition-colors hover:bg-primary"
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