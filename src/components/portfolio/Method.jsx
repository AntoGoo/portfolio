import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Section from '@/components/portfolio/Section';
import Reveal from '@/components/portfolio/Reveal';
import { methodSteps } from '@/data/portfolioContent';

// Sept jalons sur une ligne de projet qui avance avec le défilement.
export default function Method() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <Section id="methode" index="05" eyebrow="Méthode" title="Sept jalons, du besoin à la mise en service">
      <div ref={ref} className="relative">
        {/* ligne de projet : horizontale sur grand écran, verticale sur mobile */}
        <span className="absolute left-[5px] top-0 h-full w-px bg-foreground/15 lg:left-0 lg:top-[5px] lg:h-px lg:w-full" />
        <motion.span
          className="absolute left-[5px] top-0 hidden h-px w-full origin-left bg-primary lg:top-[5px] lg:left-0 lg:block"
          style={{ scaleX: progress }}
        />
        <motion.span
          className="absolute left-[5px] top-0 h-full w-px origin-top bg-primary lg:hidden"
          style={{ scaleY: progress }}
        />

        <ol className="relative grid gap-10 lg:grid-cols-7 lg:gap-6">
          {methodSteps.map((step, i) => (
            <li key={step.number} className="relative pl-9 lg:pl-0 lg:pt-12">
              <span
                className="absolute left-0 top-1 h-[11px] w-[11px] rotate-45 border border-foreground bg-background lg:top-0"
                aria-hidden="true"
              />
              <Reveal delay={0.05 * i}>
                <p className="font-mono text-[12px] tabular-nums text-primary">J{step.number}</p>
                <h3 className="mt-2 font-display text-[1.75rem] leading-none">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.5] text-muted-foreground">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
