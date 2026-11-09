import { cn } from '@/lib/utils';

// En-tête de section : filet épais, titre sur 7 colonnes, chapô à droite.
// Les props index et eyebrow restent acceptées pour compatibilité mais ne
// sont plus affichées : les sections ne forment pas une séquence.
export default function Section({ id, title, lead, children, className, dark = false }) {
  return (
    <section id={id} className={cn('pt-24 md:pt-32', dark && 'ink-block pb-24 md:pb-32', className)}>
      <div className="calque-wrap">
        <header className="grid grid-cols-12 gap-y-4 border-t-[3px] border-foreground pt-4">
          <h2 className="col-span-12 max-w-[22ch] font-heading text-[2rem] font-bold leading-[1] tracking-[-0.04em] text-balance md:col-span-7 md:text-[3.2rem]">
            {title}
          </h2>
          {lead && (
            <p className="col-span-12 self-end text-base leading-relaxed text-muted-foreground md:col-span-5 md:pl-6">
              {lead}
            </p>
          )}
        </header>
        <div className="pt-10 md:pt-14">{children}</div>
      </div>
    </section>
  );
}
