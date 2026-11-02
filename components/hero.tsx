'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { Clock, Flame, Star } from 'lucide-react'
import { useRef } from 'react'
import { WhatsAppButton } from './whatsapp-button'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18])

  return (
    <section ref={ref} className="relative isolate flex min-h-svh items-end overflow-hidden pb-14 pt-32 md:items-center md:pb-24">
      <motion.div style={{ y: imageY, scale: imageScale }} className="absolute inset-0 -z-20">
        <Image
          src="/images/hero.png"
          alt="Assortiment de street food béninoise : poulet braisé, alloco et sauces pimentées"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/75 to-background/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-40 -z-10 size-[32rem] rounded-full bg-primary/25 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur"
          >
            <Flame className="size-4" aria-hidden="true" />
            Cuisiné à la braise, chaque jour à Cotonou
          </motion.div>

          <h1 className="text-balance font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-8xl">
            {['Le Goût', 'du Bénin,'].map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.54, ease }}
              className="block italic text-primary"
            >
              Livré Chaud
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
            className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Poulet braisé, amiwo, alloco… Les recettes authentiques de nos mamans, préparées avec passion et livrées
            fumantes à votre porte.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <WhatsAppButton className="w-full sm:w-auto" />
            <a
              href="#menu"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 font-medium backdrop-blur transition-colors hover:bg-white/10 md:h-16"
            >
              Voir le menu
            </a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.15 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
              <dt className="sr-only">Note</dt>
              <dd>
                <span className="font-semibold">4,9/5</span> <span className="text-muted-foreground">· 1 200+ avis</span>
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" aria-hidden="true" />
              <dt className="sr-only">Délai de livraison</dt>
              <dd>
                <span className="font-semibold">30 min</span> <span className="text-muted-foreground">· livraison</span>
              </dd>
            </div>
          </motion.dl>
        </div>
      </div>
    </section>
  )
}
