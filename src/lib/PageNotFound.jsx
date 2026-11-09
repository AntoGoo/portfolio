import { Link, useLocation } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        <p className="font-heading text-6xl font-light text-muted-foreground">404</p>
        <h1 className="mt-4 font-heading text-xl font-medium">Page introuvable</h1>
        <p className="mt-2 text-[13.5px] text-muted-foreground">
          L'adresse <span className="text-foreground">{location.pathname}</span> ne correspond à aucune page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-9 items-center rounded-md border border-border px-4 text-[13px] transition-colors hover:border-primary/60"
        >
          Retour au portfolio
        </Link>
      </div>
    </div>
  );
}
