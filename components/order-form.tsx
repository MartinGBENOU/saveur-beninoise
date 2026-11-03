'use client'

import { useActionState, useState } from 'react'
import { Loader2, ShoppingBag } from 'lucide-react'
import { createOrder } from '@/app/commander/actions'
import type { SiteContent } from '@/lib/content'
import type { MenuDish } from '@/lib/menu'
import { formatFCFA } from '@/lib/site'

const fieldClass =
  'mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30'

const labelClass = 'block text-sm font-medium text-muted-foreground'

export function OrderForm({
  dishes,
  initialDish,
  content,
}: {
  dishes: MenuDish[]
  initialDish: string
  content: SiteContent
}) {
  const [state, formAction, pending] = useActionState(createOrder, null)
  const [dishSlug, setDishSlug] = useState(
    dishes.some((dish) => dish.slug === initialDish) ? initialDish : (dishes[0]?.slug ?? ''),
  )
  const [quantity, setQuantity] = useState(1)

  const selected = dishes.find((dish) => dish.slug === dishSlug) ?? dishes[0]
  const total = (selected?.price ?? 0) * quantity

  return (
    <form action={formAction} className="rounded-[2rem] border border-white/[0.07] bg-card p-6 shadow-2xl shadow-black/40 md:p-9">
      <div className="grid gap-6">
        <div>
          <label htmlFor="dish" className={labelClass}>
            Votre plat
          </label>
          <select
            id="dish"
            name="dish"
            value={dishSlug}
            onChange={(event) => setDishSlug(event.target.value)}
            className={fieldClass}
          >
            {dishes.map((dish) => (
              <option key={dish.slug} value={dish.slug} className="bg-card text-foreground">
                {dish.name} — {formatFCFA(dish.price)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className={labelClass}>
            Quantité
          </label>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="size-12 rounded-full border border-white/10 bg-white/[0.04] text-xl font-semibold transition-colors hover:border-primary/50"
              aria-label="Diminuer la quantité"
            >
              −
            </button>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(event) => {
                const next = Number.parseInt(event.target.value, 10)
                setQuantity(Number.isInteger(next) ? Math.min(20, Math.max(1, next)) : 1)
              }}
              className="h-12 w-20 rounded-2xl border border-white/10 bg-white/[0.04] text-center text-lg font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(20, value + 1))}
              className="size-12 rounded-full border border-white/10 bg-white/[0.04] text-xl font-semibold transition-colors hover:border-primary/50"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
            <p className="ml-auto font-display text-2xl font-semibold text-primary">{formatFCFA(total)}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Votre nom
            </label>
            <input id="name" name="name" type="text" required autoComplete="name" placeholder="Afiavi K." className={fieldClass} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Téléphone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              placeholder="01 99 56 11 44"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            Adresse de livraison
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            autoComplete="street-address"
            placeholder="Quartier, rue, repère (ex. Haie Vive, près de la pharmacie)"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>
            Précisions <span className="font-normal text-muted-foreground/70">(facultatif)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={500}
            placeholder="Bien pimenté, sans oignons, livraison vers 19h…"
            className={fieldClass}
          />
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp text-base font-semibold text-whatsapp-foreground shadow-[0_10px_40px_-8px] shadow-whatsapp/60 ring-1 ring-white/20 transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            Enregistrement…
          </>
        ) : (
          <>
            <ShoppingBag className="size-5" aria-hidden="true" />
            {content['order.submit']}
          </>
        )}
      </button>

      <p className="mt-4 text-center text-sm text-muted-foreground">{content['order.note']}</p>
    </form>
  )
}
