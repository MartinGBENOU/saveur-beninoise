import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowDown, ArrowUp, LogOut, Plus, Save, Trash2 } from 'lucide-react'
import { AdminLogin } from '@/components/admin-login'
import { AdminNav } from '@/components/admin-nav'
import { ConfirmSubmit } from '@/components/confirm-submit'
import { logout } from '@/app/admin/actions'
import {
  createDish,
  deleteDish,
  moveDish,
  restoreDefaultMenu,
  updateDish,
} from '@/app/admin/menu/actions'
import { isAdminAuthenticated, isAdminConfigured } from '@/lib/admin-auth'
import { isDatabaseConfigured } from '@/lib/db'
import { DISH_IMAGES, getAllDishes, type MenuDish } from '@/lib/menu'
import { formatFCFA } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Carte du menu — Saveur Béninoise',
  robots: { index: false, follow: false },
}

// Le menu doit toujours refléter la base : jamais de version en cache.
export const dynamic = 'force-dynamic'

const fieldClass =
  'mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30'

const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-muted-foreground'

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:brightness-110'

const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30'

function imageOptionsFor(image: string) {
  return DISH_IMAGES.some((option) => option.value === image)
    ? DISH_IMAGES
    : [{ value: image, label: 'Photo actuelle' }, ...DISH_IMAGES]
}

function DishFields({ dish }: { dish?: MenuDish }) {
  const prefix = dish?.slug ?? 'nouveau'
  const imageOptions = imageOptionsFor(dish?.image ?? DISH_IMAGES[0].value)

  return (
    <>
      <div>
        <label htmlFor={`${prefix}-name`} className={labelClass}>
          Nom du plat
        </label>
        <input
          id={`${prefix}-name`}
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          defaultValue={dish?.name}
          placeholder="Ex. Poulet braisé"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor={`${prefix}-price`} className={labelClass}>
          Prix (FCFA)
        </label>
        <input
          id={`${prefix}-price`}
          name="price"
          type="number"
          required
          min={100}
          max={100000}
          step={50}
          defaultValue={dish?.price}
          placeholder="3500"
          className={fieldClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}-description`} className={labelClass}>
          Description
        </label>
        <textarea
          id={`${prefix}-description`}
          name="description"
          required
          rows={3}
          minLength={5}
          maxLength={300}
          defaultValue={dish?.description}
          placeholder="Poulet mariné 12h, grillé au feu de bois, oignons et piment frais."
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor={`${prefix}-tag`} className={labelClass}>
          Badge <span className="normal-case tracking-normal text-muted-foreground/70">(facultatif)</span>
        </label>
        <input
          id={`${prefix}-tag`}
          name="tag"
          type="text"
          maxLength={40}
          defaultValue={dish?.tag ?? ''}
          placeholder="Ex. N°1 des ventes"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor={`${prefix}-image`} className={labelClass}>
          Photo
        </label>
        <select
          id={`${prefix}-image`}
          name="image"
          defaultValue={dish?.image ?? DISH_IMAGES[0].value}
          className={fieldClass}
        >
          {imageOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-card text-foreground">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2.5 text-sm sm:col-span-2">
        <input
          type="checkbox"
          name="available"
          defaultChecked={dish?.available ?? true}
          className="size-4 accent-primary"
        />
        Disponible à la commande
      </label>
    </>
  )
}

export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>
}) {
  const { ok, erreur } = await searchParams

  if (!isAdminConfigured()) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24">
        <h1 className="font-display text-3xl font-semibold">Carte du menu</h1>
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
  const menu = await getAllDishes()

  return (
    <main className="mx-auto max-w-5xl px-5 py-16 md:py-24">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Espace commandes</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Carte du menu</h1>
        </div>
        <form action={logout}>
          <button type="submit" className={ghostButtonClass}>
            <LogOut className="size-4" aria-hidden="true" />
            Déconnexion
          </button>
        </form>
      </header>

      <div className="mt-6">
        <AdminNav current="menu" />
      </div>

      {!databaseReady && (
        <p className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
          La base de données n&apos;est pas connectée : le menu affiché est le menu de secours et aucune modification ne
          peut être enregistrée. Vérifiez l&apos;intégration Neon sur Vercel.
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

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        Modifiez un plat, son prix ou sa disponibilité : le site est mis à jour immédiatement. Un plat décoché
        « Disponible » disparaît de la carte publique et ne peut plus être commandé.
      </p>

      <section aria-labelledby="ajouter-plat" className="mt-8">
        <details className="group rounded-3xl border border-white/[0.07] bg-card shadow-2xl shadow-black/30">
          <summary
            id="ajouter-plat"
            className="flex cursor-pointer list-none items-center gap-3 p-5 font-semibold [&::-webkit-details-marker]:hidden"
          >
            <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-primary">
              <Plus className="size-4" aria-hidden="true" />
            </span>
            Ajouter un plat
            <span className="ml-auto text-xs font-normal text-muted-foreground group-open:hidden">Ouvrir</span>
          </summary>

          <form action={createDish} className="grid gap-4 border-t border-white/[0.07] p-5 sm:grid-cols-2">
            <DishFields />
            <div className="sm:col-span-2">
              <button type="submit" className={primaryButtonClass}>
                <Plus className="size-4" aria-hidden="true" />
                Ajouter à la carte
              </button>
            </div>
          </form>
        </details>
      </section>

      <section aria-labelledby="liste-plats" className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="liste-plats" className="font-display text-2xl font-semibold">
            Plats de la carte
          </h2>
          <p className="text-sm text-muted-foreground">
            {menu.length} plat{menu.length > 1 ? 's' : ''}
          </p>
        </div>

        {menu.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-white/[0.07] bg-card p-8 text-center">
            <p className="font-display text-xl font-semibold">Votre carte est vide</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Ajoutez un premier plat ci-dessus, ou repartez du menu d&apos;origine en un clic.
            </p>
            <form action={restoreDefaultMenu} className="mt-5">
              <button type="submit" className={primaryButtonClass}>
                Restaurer le menu de départ
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {menu.map((dish, index) => (
              <details
                key={dish.slug}
                className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
                  <Image
                    src={dish.image}
                    alt=""
                    width={64}
                    height={64}
                    className="size-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 font-medium">
                      {dish.name}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          dish.available
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-red-500/15 text-red-300'
                        }`}
                      >
                        {dish.available ? 'Disponible' : 'Épuisé'}
                      </span>
                      {dish.tag && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {dish.tag}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatFCFA(dish.price)}</p>
                  </div>
                  <span className="shrink-0 font-display text-sm font-semibold text-primary">
                    <span className="group-open:hidden">Modifier</span>
                    <span className="hidden group-open:inline">Fermer</span>
                  </span>
                </summary>

                <div className="border-t border-white/[0.07] p-4">
                  <form action={updateDish} className="grid gap-4 sm:grid-cols-2">
                    <input type="hidden" name="slug" value={dish.slug} />
                    <DishFields dish={dish} />
                    <div className="sm:col-span-2">
                      <button type="submit" className={primaryButtonClass}>
                        <Save className="size-4" aria-hidden="true" />
                        Enregistrer
                      </button>
                    </div>
                  </form>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4">
                    <form action={moveDish}>
                      <input type="hidden" name="slug" value={dish.slug} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={index === 0}
                        className={ghostButtonClass}
                        aria-label={`Monter ${dish.name} dans la carte`}
                      >
                        <ArrowUp className="size-4" aria-hidden="true" />
                        Monter
                      </button>
                    </form>

                    <form action={moveDish}>
                      <input type="hidden" name="slug" value={dish.slug} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={index === menu.length - 1}
                        className={ghostButtonClass}
                        aria-label={`Descendre ${dish.name} dans la carte`}
                      >
                        <ArrowDown className="size-4" aria-hidden="true" />
                        Descendre
                      </button>
                    </form>

                    <form action={deleteDish} className="ml-auto">
                      <input type="hidden" name="slug" value={dish.slug} />
                      <input type="hidden" name="name" value={dish.name} />
                      <ConfirmSubmit
                        message={`Supprimer « ${dish.name} » de la carte ? Cette action est définitive.`}
                        className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        Supprimer
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        Les photos proposées sont celles du site. Pour utiliser une nouvelle photo, envoyez-la nous : nous
        l&apos;optimiserons et l&apos;ajouterons à la liste.
      </p>
    </main>
  )
}
