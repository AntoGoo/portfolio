import { profile as defaultProfile } from '@/data/portfolioContent';
import { downloadCv } from '@/lib/generateCv';
import useInView from '@/hooks/useInView';

const parseYear = (value) => {
  const n = parseInt(String(value || '').slice(0, 4), 10);
  return Number.isFinite(n) ? n : null;
};

function PlanBar({ experiences }) {
  const [ref, on] = useInView({ threshold: 0.6 });
  const now = new Date().getFullYear();
  const starts = (experiences || []).map((e) => parseYear(e.start)).filter(Boolean);
  const first = starts.length ? Math.min(...starts) : 2000;
  const span = Math.max(now - first, 1);
  const marks = [...new Set([first, ...starts, now])].sort((a, b) => a - b);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative h-14 border-y border-foreground ${on ? 'is-on' : ''}`}
    >
      <div className="plan-bar" />
      {marks.map((year) => {
        const left = ((year - first) / span) * 100;
        return (
          <span key={year}>
            <i className="plan-dot" style={{ left: `${left}%`, transitionDelay: `${0.1 + (left / 100) * 1.5}s` }} />
            <span
              className="absolute bottom-1 text-[12px] text-muted-foreground"
              style={{
                left: `${left}%`,
                transform: left > 95 ? 'translateX(-100%)' : left < 5 ? 'translateX(8px)' : 'translateX(-50%)',
              }}
            >
              {year}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function Hero({ profile = defaultProfile, experiences }) {
  const [firstName, ...rest] = profile.name.split(' ');

  return (
    <section id="top" className="pt-[68px]">
      <div className="calque-wrap pt-14 md:pt-20">
        <h1 className="font-heading text-[3.4rem] font-extrabold leading-[0.86] tracking-[-0.055em] sm:text-[5.5rem] lg:text-[9.6rem]">
          {firstName}
          {rest.length > 0 && <span className="block lg:pl-[25%]">{rest.join(' ')}</span>}
        </h1>

        <div className="mt-12 grid grid-cols-12 border-t border-foreground">
          <div className="col-span-12 pb-4 pt-4 pr-4 md:col-span-3 md:pb-7">
            <span className="block text-[13px] text-muted-foreground">{profile.location}</span>
            <span className="text-[17px] font-medium">{profile.role}</span>
          </div>
          <p className="col-span-12 pb-4 pt-0 text-[1.35rem] font-medium leading-tight tracking-[-0.015em] md:col-span-5 md:pt-4 md:pb-7 md:pr-6 md:text-[1.6rem]">
            {profile.tagline}
          </p>
          <div className="col-span-12 pb-7 md:col-span-4 md:pt-4">
            <p className="text-[15px] leading-relaxed text-muted-foreground">{profile.intro}</p>
            <div className="mt-5 flex flex-wrap gap-6 text-[15px] font-semibold">
              <a href="#parcours" className="line-link">
                Voir le parcours
              </a>
              <button type="button" className="line-link" onClick={() => downloadCv({ profile, experiences })}>
                Télécharger le CV
              </button>
            </div>
          </div>
        </div>

        <PlanBar experiences={experiences} />
      </div>
    </section>
  );
}
