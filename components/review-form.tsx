'use client'

import { useActionState } from 'react'
import { Loader2, Send } from 'lucide-react'
import { submitReview } from '@/app/avis/actions'
import type { SiteContent } from '@/lib/content'

const fieldClass =
  'mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30'

const labelClass = 'block text-sm font-medium text-muted-foreground'

const RATING_LABELS: Record<number, string> = {
  5: '5 étoiles — Excellent',
  4: '4 étoiles — Très bien',
  3: '3 étoiles — Bien',
  2: '2 étoiles — Moyen',
  1: '1 étoile — À revoir',
}

export function ReviewForm({ content }: { content: SiteContent }) {
  const [state, formAction, pending] = useActionState(submitReview, null)

  if (state?.success) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-sm leading-relaxed text-emerald-200"
      >
        {content['reviews.thanks']}
      </p>
    )
  }

  return (
    <form action={formAction} className="relative grid gap-4 sm:grid-cols-2">
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="review-website">Ne pas remplir</label>
        <input id="review-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="review-name" className={labelClass}>
          {content['reviews.nameLabel']}
        </label>
        <input
          id="review-name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={60}
          autoComplete="given-name"
          placeholder="Afiavi"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="review-location" className={labelClass}>
          {content['reviews.locationLabel']}{' '}
          <span className="font-normal text-muted-foreground/70">(facultatif)</span>
        </label>
        <input
          id="review-location"
          name="location"
          type="text"
          maxLength={60}
          placeholder="Haie Vive, Cotonou"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="review-rating" className={labelClass}>
          {content['reviews.ratingLabel']}
        </label>
        <select id="review-rating" name="rating" defaultValue="5" className={fieldClass}>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value} className="bg-card text-foreground">
              {RATING_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="review-quote" className={labelClass}>
          {content['reviews.quoteLabel']}
        </label>
        <textarea
          id="review-quote"
          name="quote"
          required
          rows={4}
          minLength={10}
          maxLength={500}
          placeholder="Ce que vous avez aimé : le plat, la livraison, l’accueil…"
          className={fieldClass}
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:col-span-2"
        >
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Envoi…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              {content['reviews.submit']}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
