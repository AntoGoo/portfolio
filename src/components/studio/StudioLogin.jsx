import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Field from '@/components/studio/Field';

export default function StudioLogin({ session, onLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api.auth.login(email, password);
      setPassword('');
      onLoggedIn();
    } catch (err) {
      setError(err.message.replace(/^Erreur \d+ : /, ''));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-[380px]">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card font-heading text-[13px] font-bold">
            AG
          </span>
          <div>
            <p className="font-heading text-[13.5px] font-medium">Espace privé</p>
            <p className="text-[11px] text-muted-foreground">Gestion du portfolio</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-xl border border-border bg-card p-7">
          <div>
            <h1 className="flex items-center gap-2 font-heading text-[20px] font-semibold tracking-[-0.02em]">
              <Lock className="h-4 w-4 text-primary" />
              Connexion
            </h1>
            {session?.expired && (
              <p className="mt-2 text-[12.5px] text-muted-foreground">Session expirée : reconnectez-vous pour continuer.</p>
            )}
          </div>

          {session?.configured === false && (
            <p role="alert" className="rounded-md border border-destructive/40 p-3 text-[12.5px] text-destructive">
              Connexion non configurée : ajoutez STUDIO_EMAIL et STUDIO_PASSWORD dans les variables du projet Cloudflare
              Pages, puis redéployez.
            </p>
          )}

          <Field label="E-mail">
            <Input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </Field>
          <Field label="Mot de passe" error={error}>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Button type="submit" className="w-full" disabled={pending || !email || !password}>
            {pending ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour au site
        </Link>
      </div>
    </div>
  );
}
