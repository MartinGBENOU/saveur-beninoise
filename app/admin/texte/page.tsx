import type { Metadata } from 'next'
import { LogOut, RotateCcw, Save, Sparkles } from 'lucide-react'
import { AdminLogin } from '@/components/admin-login'
import { AdminNav } from '@/components/admin-nav'
import { ConfirmSubmit } from '@/components/confirm-submit'
import { logout } from '@/app/admin/actions'
import { restoreContent, saveContent } from '@/app/admin/texte/actions'
import { isAdminAuthenticated, isAdminConfigured } from '@/lib/admin-auth'
import { contentGroups } from '@/lib/content'
import { getContent } from '@/lib/content-server'
import { isDatabaseConfigured } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Textes du site — Saveur Béninoise',
  robots: { index: false, follow: false },
}

// Les textes doivent toujours refléter la base : jamais de version en cache.
export const dynamic = 'force-dynamic'

const fieldClass =
  'mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30'

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:brightness-110'

const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>
}) {
  const { ok, erreur } = await searchParams

  if (!isAdminConfigured()) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24">
        <h1 className="font-display text-3xl font-semibold">Textes du site</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Le mot de passe administrateur n&apos;est pas encore configuré. Ajoutez la variable{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5">ADMIN_PASSWORD</code> sur Vercel, puis redéployez.
        </p>
      </main>
    )
  }

  if (!(await isAdminAuthenticated())) {
    return (
      <main className="px-5 py-24">
        <AdminLogin />
      </main>
    )
  }

  const databaseReady = isDatabaseConfigured()
  const content = await getContent()

  return (
    <main className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Espace commandes</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Textes du site</h1>
        </div>
        <form action={logout}>
          <button type="submit" className={ghostButtonClass}>
            <LogOut className="size-4" aria-hidden="true" />
            Déconnexion
          </button>
        </form>
      </header>

      <div className="mt-6">
        <AdminNav current="content" />
      </div>

      {!databaseReady && (
        <p className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
          La base de données n&apos;est pas connectée : les textes affichés sont ceux d&apos;origine et aucune
          modification ne peut être enregistrée. Vérifiez l&apos;intégration Neon sur Vercel.
        </p>
      )}

      {ok && (
        <p role="status" className="mt-8 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
          {ok}
        </p>
      )}

      {erreur && (
        <p role="alert" className="mt-8 rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
          {erreur}
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.06] px-5 py-4 text-sm leading-relaxed text-muted-foreground">
        <p className="flex items-center gap-2 font-semibold text-foreground">
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
          Mise en forme rapide
        </p>
        <ul className="mt-2 space-y-1">
          <li>
            <code className="rounded bg-white/10 px-1.5 py-0.5">*un mot*</code> affiche le mot en italique orange.
          </li>
          <li>
            <code className="rounded bg-white/10 px-1.5 py-0.5">{'{nombre}'}</code> est remplacé par le nombre de plats
            de la carte.
          </li>
          <li>
            <code className="rounded bg-white/10 px-1.5 py-0.5">{'{année}'}</code> est remplacé par l&apos;année en
            cours.
          </li>
          <li>
            Les horaires s&apos;écrivent une ligne par créneau, au format <em>Jours | Horaires</em>.
          </li>
        </ul>
      </div>

      <form action={saveContent} className="mt-8 space-y-6">
        {contentGroups.map((group) => (
          <fieldset key={group.id} className="rounded-3xl border border-white/[0.07] bg-card p-5 shadow-xl shadow-black/20 md:p-6">
            <legend className="px-2 font-display text-xl font-semibold">{group.title}</legend>
            {group.description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{group.description}</p>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => {
                const id = `champ-${field.key}`
                const wide = field.type === 'textarea'

                return (
                  <div key={field.key} className={wide ? 'sm:col-span-2' : undefined}>
                    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {field.label}
                    </label>
                    {wide ? (
                      <textarea
                        id={id}
                        name={field.key}
                        rows={field.key === 'hours' ? 4 : 3}
                        maxLength={5000}
                        defaultValue={content[field.key]}
                        className={fieldClass}
                      />
                    ) : (
                      <input
                        id={id}
                        name={field.key}
                        type="text"
                        maxLength={5000}
                        defaultValue={content[field.key]}
                        className={fieldClass}
                      />
                    )}
                    {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
                  </div>
                )
              })}
            </div>
          </fieldset>
        ))}

        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/[0.07] bg-card p-5">
          <button type="submit" className={primaryButtonClass}>
            <Save className="size-4" aria-hidden="true" />
            Enregistrer tous les textes
          </button>
          <p className="text-sm text-muted-foreground">
            Les changements sont visibles immédiatement sur le site public.
          </p>
        </div>
      </form>

      <section aria-labelledby="restaurer-textes" className="mt-10 rounded-3xl border border-white/[0.07] bg-card p-5">
        <h2 id="restaurer-textes" className="font-display text-xl font-semibold">
          Revenir aux textes d&apos;origine
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Toutes les modifications de textes seront effacées. La carte, les photos et les avis ne sont pas concernés.
        </p>
        <form action={restoreContent} className="mt-4">
          <ConfirmSubmit
            message="Restaurer tous les textes d'origine ? Vos modifications seront perdues."
            className={ghostButtonClass}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Restaurer les textes d&apos;origine
          </ConfirmSubmit>
        </form>
      </section>
    </main>
  )
}
