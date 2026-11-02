import type { Metadata } from 'next'
import { desc } from 'drizzle-orm'
import { LogOut } from 'lucide-react'
import { AdminLogin } from '@/components/admin-login'
import { logout, updateOrderStatus } from '@/app/admin/actions'
import { isAdminAuthenticated, isAdminConfigured } from '@/lib/admin-auth'
import { getDb, isDatabaseConfigured } from '@/lib/db'
import { orders, type Order } from '@/lib/schema'
import { formatFCFA } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Commandes — Saveur Béninoise',
  robots: { index: false, follow: false },
}

// Les commandes changent en permanence : jamais de version mise en cache.
export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  nouvelle: 'bg-primary/15 text-primary',
  confirmée: 'bg-blue-500/15 text-blue-300',
  livrée: 'bg-emerald-500/15 text-emerald-300',
  annulée: 'bg-red-500/15 text-red-300',
}

export default async function AdminPage() {
  if (!isAdminConfigured()) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-24">
        <h1 className="font-display text-3xl font-semibold">Espace commandes</h1>
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
  let rows: Order[] = []
  let databaseError = false

  if (databaseReady) {
    try {
      rows = await getDb().select().from(orders).orderBy(desc(orders.createdAt)).limit(200)
    } catch (error) {
      console.error('[admin] lecture des commandes impossible :', error)
      databaseError = true
    }
  }

  const revenue = rows
    .filter((order) => order.status !== 'annulée')
    .reduce((sum, order) => sum + order.total, 0)

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Espace commandes</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Commandes reçues</h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium transition-colors hover:border-destructive/50 hover:text-destructive"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Déconnexion
          </button>
        </form>
      </header>

      {!databaseReady && (
        <p className="mt-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">
          La base de données n&apos;est pas connectée. Ajoutez l&apos;intégration Neon au projet Vercel (variable{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5">DATABASE_URL</code>) puis redéployez.
        </p>
      )}

      {databaseError && (
        <p className="mt-8 rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive">
          La base de données ne répond pas pour le moment. Vérifiez l&apos;intégration Neon sur Vercel puis rechargez la page.
        </p>
      )}

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.07] bg-card p-5">
          <dt className="text-sm text-muted-foreground">Commandes affichées</dt>
          <dd className="mt-1 font-display text-3xl font-semibold">{rows.length}</dd>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-card p-5">
          <dt className="text-sm text-muted-foreground">Nouvelles</dt>
          <dd className="mt-1 font-display text-3xl font-semibold">
            {rows.filter((order) => order.status === 'nouvelle').length}
          </dd>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-card p-5">
          <dt className="text-sm text-muted-foreground">Chiffre d&apos;affaires</dt>
          <dd className="mt-1 font-display text-3xl font-semibold">{formatFCFA(revenue)}</dd>
        </div>
      </dl>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-white/[0.07] bg-card px-5 py-8 text-center text-muted-foreground">
          Aucune commande pour le moment. Elles apparaîtront ici dès le premier formulaire validé.
        </p>
      ) : (
        <div className="mt-10 overflow-x-auto rounded-3xl border border-white/[0.07] bg-card shadow-2xl shadow-black/40">
          <table className="w-full min-w-[54rem] text-left text-sm">
            <thead className="border-b border-white/[0.07] text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-4">Date</th>
                <th scope="col" className="px-5 py-4">Client</th>
                <th scope="col" className="px-5 py-4">Commande</th>
                <th scope="col" className="px-5 py-4">Adresse</th>
                <th scope="col" className="px-5 py-4">Total</th>
                <th scope="col" className="px-5 py-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} className="border-b border-white/[0.05] last:border-0">
                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                    {order.createdAt.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">{order.customerName}</p>
                    <a href={`tel:${order.phone.replace(/\s/g, '')}`} className="text-whatsapp hover:underline">
                      {order.phone}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {order.quantity} × {order.dish}
                    </p>
                    {order.notes && <p className="mt-1 max-w-56 text-xs text-muted-foreground">{order.notes}</p>}
                  </td>
                  <td className="max-w-56 px-5 py-4 text-muted-foreground">{order.address}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold">{formatFCFA(order.total)}</td>
                  <td className="px-5 py-4">
                    <form action={updateOrderStatus} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={order.id} />
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[order.status] ?? 'bg-white/10 text-foreground'}`}
                      >
                        {order.status}
                      </span>
                      <select
                        name="status"
                        defaultValue={order.status}
                        aria-label={`Nouveau statut pour la commande de ${order.customerName}`}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs outline-none focus:border-primary"
                      >
                        <option value="nouvelle">nouvelle</option>
                        <option value="confirmée">confirmée</option>
                        <option value="livrée">livrée</option>
                        <option value="annulée">annulée</option>
                      </select>
                      <button type="submit" className="text-xs font-semibold text-primary hover:underline">
                        OK
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Les 200 commandes les plus récentes sont affichées. Pensez à exporter régulièrement vos données.
      </p>
    </main>
  )
}
