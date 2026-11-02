'use client'

import { useActionState } from 'react'
import { Loader2, LockKeyhole } from 'lucide-react'
import { login } from '@/app/admin/actions'

export function AdminLogin() {
  const [state, formAction, pending] = useActionState(login, null)

  return (
    <form action={formAction} className="mx-auto mt-16 w-full max-w-sm rounded-3xl border border-white/[0.07] bg-card p-8 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-primary/15 text-primary">
          <LockKeyhole className="size-5" aria-hidden="true" />
        </span>
        <h1 className="font-display text-2xl font-semibold">Espace commandes</h1>
      </div>

      <label htmlFor="password" className="mt-8 block text-sm font-medium text-muted-foreground">
        Mot de passe
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
      />

      {state?.error && (
        <p role="alert" className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Se connecter
      </button>
    </form>
  )
}
