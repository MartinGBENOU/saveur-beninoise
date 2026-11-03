import type { Metadata } from 'next'
import { Check, Clock, EyeOff, LogOut, MessageSquare, Star, Trash2 } from 'lucide-react'
import { AdminLogin } from '@/components/admin-login'
import { AdminNav } from '@/components/admin-nav'
import { ConfirmSubmit } from '@/components/confirm-submit'
import { logout } from '@/app/admin/actions'
import { deleteReview, setReviewApproval } from '@/app/admin/avis/actions'
import { isAdminAuthenticated, isAdminConfigured } from '@/lib/admin-auth'
import { isDatabaseConfigured } from '@/lib/db'
import { getAllReviews, type Review } from '@/lib/reviews'

export const metadata: Metadata = {
  title: 'Avis clients — Saveur Béninoise',
  robots: { index: false, follow: false },
}

// Les avis doivent toujours refléter la base : jamais de version en cache.
export const dynamic = 'force-dynamic'

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:brightness-110'

const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'

const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Africa/Porto-Novo',
})

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${rating} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={index < rating ? 'size-4 fill-primary text-primary' : 'size-4 text-muted'}
        />
      ))}
    </span>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-2xl border border-white/[0.07] bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            {review.name}
            {review.location && <span className="text-sm font-normal text-muted-foreground">· {review.location}</span>}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Stars rating={review.rating} />
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden="true" />
              {dateFormat.format(review.createdAt)}
            </span>
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            review.approved ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-200'
          }`}
        >
          {review.approved ? 'Publié' : 'En attente'}
        </span>
      </div>

      <blockquote className="mt-4 text-pretty leading-relaxed text-muted-foreground">
        {`« ${review.quote} »`}
      </blockquote>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4">
        {review.approved ? (
          <form action={setReviewApproval}>
            <input type="hidden" name="id" value={review.id} />
            <input type="hidden" name="approved" value="false" />
            <button type="submit" className={ghostButtonClass}>
              <EyeOff className="size-4" aria-hidden="true" />
              Retirer du site
            </button>
          </form>
        ) : (
          <form action={setReviewApproval}>
            <input type="hidden" name="id" value={review.id} />
            <input type="hidden" name="approved" value="true" />
            <button type="submit" className={primaryButtonClass}>
              <Check className="size-4" aria-hidden="true" />
              Publier cet avis
            </button>
          </form>
        )}

        <form action={deleteReview} className="ml-auto">
          <input type="hidden" name="id" value={review.id} />
          <ConfirmSubmit
            message={`Supprimer définitivement l'avis de « ${review.name} » ?`}
            className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Supprimer
          </ConfirmSubmit>
        </form>
      </div>
    </article>
  )
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>
}) {
  const { ok, erreur } = await searchParams

  if (!isAdminConfigured()) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24">
        <h1 className="font-display text-3xl font-semibold">Avis clients</h1>
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
  const reviews = await getAllReviews()
  const pending = reviews.filter((review) => !review.approved)
  const published = reviews.filter((review) => review.approved)

  return (
    <main className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Espace commandes</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Avis clients</h1>
        </div>
        <form action={logout}>
          <button type="submit" className={ghostButtonClass}>
            <LogOut className="size-4" aria-hidden="true" />
            Déconnexion
          </button>
        </form>
      </header>

      <div className="mt-6">
        <AdminNav current="reviews" />
      </div>

      {!databaseReady && (
        <p className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
          La base de données n&apos;est pas connectée : les avis affichés sont ceux d&apos;origine et aucune modification
          ne peut être enregistrée.
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

      <p className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 text-sm leading-relaxed text-muted-foreground">
        <MessageSquare className="mr-2 inline size-4 text-primary" aria-hidden="true" />
        Les avis envoyés depuis le site arrivent ici <strong className="text-foreground">avant publication</strong>.
        Relisez-les, puis publiez ceux que vous voulez voir apparaître sur la page d&apos;accueil.
      </p>

      <section aria-labelledby="avis-en-attente" className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="avis-en-attente" className="font-display text-2xl font-semibold">
            En attente de validation
          </h2>
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-sm font-semibold text-amber-200">
            {pending.length}
          </span>
        </div>

        {pending.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-white/[0.07] bg-card px-5 py-6 text-sm text-muted-foreground">
            Aucun avis en attente. Les nouveaux avis apparaîtront ici automatiquement.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {pending.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="avis-publies" className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="avis-publies" className="font-display text-2xl font-semibold">
            Avis publiés
          </h2>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
            {published.length}
          </span>
        </div>

        {published.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-white/[0.07] bg-card px-5 py-6 text-sm text-muted-foreground">
            Aucun avis publié pour le moment.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {published.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
