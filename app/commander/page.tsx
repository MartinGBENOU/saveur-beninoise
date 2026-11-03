import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { OrderForm } from '@/components/order-form'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { RichText } from '@/components/rich-text'
import { SiteHeader } from '@/components/site-header'
import { whatsappLinkFor } from '@/lib/content'
import { getContent } from '@/lib/content-server'
import { getMenu } from '@/lib/menu'
import { formatFCFA } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Commander — Saveur Béninoise',
  description:
    'Composez votre commande en 30 secondes : plat, quantité, adresse. Nous confirmons sur WhatsApp et livrons chaud à Cotonou.',
  alternates: { canonical: '/commander' },
  robots: { index: true, follow: true },
}

export default async function CommanderPage({
  searchParams,
}: {
  searchParams: Promise<{ plat?: string }>
}) {
  const { plat } = await searchParams
  const [menu, content] = await Promise.all([getMenu(), getContent()])

  const requested = typeof plat === 'string' ? plat : ''
  const featured = menu.find((dish) => dish.slug === requested) ?? menu[0]
  const initialDish = featured?.slug ?? ''

  return (
    <>
      <SiteHeader content={content} />
      <main className="relative overflow-hidden pb-24 pt-32 md:pt-40">
        <div aria-hidden="true" className="absolute -right-32 top-10 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[140px]" />
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{content['order.eyebrow']}</p>
              <h1 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight md:text-5xl">
                <RichText text={content['order.title']} />
              </h1>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{content['order.description']}</p>

              {featured && (
                <div className="mt-8 rounded-3xl border border-white/[0.07] bg-card p-6 shadow-2xl shadow-black/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Votre sélection</p>
                  <p className="mt-3 font-display text-2xl font-semibold">{featured.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{featured.description}</p>
                  <p className="mt-4 font-display text-xl font-semibold text-primary">{formatFCFA(featured.price)}</p>
                </div>
              )}

              <p className="mt-6 text-sm text-muted-foreground">
                Une question ? Appelez-nous au{' '}
                <a href={`tel:+${content['contact.phoneNumber'].replace(/[^0-9]/g, '')}`} className="font-semibold text-whatsapp hover:underline">
                  {content['contact.phoneDisplay']}
                </a>
                .
              </p>
            </div>

            {menu.length > 0 ? (
              <OrderForm dishes={menu} initialDish={initialDish} content={content} />
            ) : (
              <div className="rounded-[2rem] border border-white/[0.07] bg-card p-8 text-center shadow-2xl shadow-black/40">
                <p className="font-display text-2xl font-semibold">La carte est en cours de mise à jour</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{content['menu.empty']}</p>
                <a
                  href={whatsappLinkFor(content)}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-whatsapp-foreground transition-transform hover:-translate-y-0.5"
                >
                  Nous écrire sur WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <FloatingWhatsApp href={whatsappLinkFor(content)} label={content['nav.order']} />
    </>
  )
}
