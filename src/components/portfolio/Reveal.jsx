import { cn } from '@/lib/utils';

// Plus d'apparition en fondu : le seul mouvement non déclenché par
// l'utilisateur est le tracé du planning (Hero et Parcours).
// eslint-disable-next-line no-unused-vars
export default function Reveal({ children, className, delay, y }) {
  return <div className={cn(className)}>{children}</div>;
}
