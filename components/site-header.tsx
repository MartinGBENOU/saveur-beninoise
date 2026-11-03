'use client'

import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { SiteContent } from '@/lib/content'
import { cn } from '@/lib/utils'

export function SiteHeader({ content }: { content: SiteContent }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  const links = [
    { href: '#menu', label: content['nav.menu'] },
    { href: '#avis', label: content['nav.reviews'] },
    { href: '#infos', label: content['nav.infos'] },
  ]

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4"
    >
      <div
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border px-3 py-2 pl-5 transition-all duration-500',
          scrolled
            ? 'border-white/10 bg-background/75 shadow-2xl shadow-black/40 backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <a href="#" className="flex items-center gap-2" aria-label="Saveur Béninoise, accueil">
          <span className="grid size-8 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
            S
          </span>
          <span className="whitespace-nowrap font-display text-base font-semibold tracking-tight sm:text-lg">
            Saveur <span className="text-primary">Béninoise</span>
          </span>
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>

        <Link
          href="/commander"
          className="group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 text-sm font-semibold text-whatsapp-foreground shadow-[0_10px_40px_-8px] shadow-whatsapp/60 ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-whatsapp/50"
        >
          <ShoppingBag className="size-4 shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
          {content['nav.order']}
        </Link>
      </div>
    </motion.header>
  )
}
