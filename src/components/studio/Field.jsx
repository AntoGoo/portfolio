import { Label } from '@/components/ui/label';

export default function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-[11.5px] text-muted-foreground/80">{hint}</p>}
    </div>
  );
}