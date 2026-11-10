import { tagColor } from '@/lib/tagStyle';
import { cn } from '@/lib/utils';

// Carré plein de la couleur du tag, posé devant un libellé neutre.
export default function TagDot({ tag, size = 7, className }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, background: tagColor(tag) }}
      className={cn('inline-block shrink-0', className)}
    />
  );
}
