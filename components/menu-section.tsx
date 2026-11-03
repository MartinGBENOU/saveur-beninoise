'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { formatFCFA } from '@/lib/site'
import type { MenuDish } from '@/lib/menu'
import { SectionHeading } from './section-heading'
import { WhatsAppButton } from './whatsapp-button'

function DishCard({ dish, index }: { dish: MenuDish; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-card shadow-2xl shadow-black/40 transition-colors hover:border-primary/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        {dish.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
            {dish.tag}
          </span>
        )}
      </div>

      <div className="relative -mt-6 p-6 pt-0">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold tracking-tight">{dish.name}</h3>
          <p className="shrink-0 rounded-full bg-primary/10 px-3 py-1 font-display text-lg font-semibold text-primary">
            {formatFCFA(dish.price)}
          </p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{dish.description}</p>

        <Link
          href={`/commander?plat=${encodeURIComponent(dish.slug)}`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-3 text-sm font-semibold transition-all hover:border-whatsapp hover:bg-whatsapp hover:text-whatsapp-foreground"
          aria-label={`Commander ce plat : ${dish.name}`}
        >
          <Plus className="size-4" aria-hidden="true" />
          Commander ce plat
        </Link>
      </div>
    </motion.article>
  )
}

export function MenuSection({ dishes }: { dishes: MenuDish[] }) {
  const description =
    dishes.length > 1
      ? `${dishes.length} recettes signatures, préparées chaque jour avec des produits frais du marché Dantokpa.`
      : 'Nos recettes signatures, préparées chaque jour avec des produits frais du marché Dantokpa.'

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative scroll-mt-24 py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/3 -z-10 size-[28rem] rounded-full bg-primary/10 blur-[140px]"
      />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="menu-title"
          eyebrow="Nos best-sellers"
          title={
            <>
              Les plats qu&apos;on <span className="italic text-primary">s&apos;arrache</span>
            </>
          }
          description={description}
        />

        {dishes.length === 0 ? (
          <p className="mx-auto max-w-xl rounded-3xl border border-white/[0.07] bg-card px-6 py-10 text-center text-muted-foreground">
            La carte est en cours de mise à jour. Écrivez-nous sur WhatsApp, nous vous disons ce qui est disponible
            aujourd&apos;hui.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish, i) => (
              <DishCard key={dish.slug} dish={dish} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-14 flex flex-col items-center gap-3 text-center"
        >
          <WhatsAppButton />
          <p className="text-sm text-muted-foreground">Livraison offerte dès 10 000 F · Paiement à la livraison ou MoMo</p>
        </motion.div>
      </div>
    </section>
  )
}
