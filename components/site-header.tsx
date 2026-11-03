'use client'

import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useState, type MouseEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import type { SiteContent } from '@/lib/content'
import { cn } from '@/lib/utils'

export function SiteHeader({ content }: { content: SiteContent }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  // Sur /commander, les sections menu/avis/infos sont sur l'accueil :
  // on préfixe les ancres par « / » pour y retourner en scrollant.
  const pathname = usePathname()
  const homeHref = pathname === '/' ? '' : '/'

  const sections = [
    { id: 'menu', label: content['nav.menu'] },
    { id: 'avis', label: content['nav.reviews'] },
    { id: 'infos', label: content['nav.infos'] },
  ]

  // Après une arrivée sur « /#avis » (ou un rechargement), Next remet parfois
  // le scroll en haut : on replace la section demandée sous l'en-tête.
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return

    const timer = window.setTimeout(() => {
      document.getElementById(decodeURIComponent(hash))?.scrollIntoView({ block: 'start' })
    }, 150)

    return () => window.clearTimeout(timer)
  }, [pathname])

  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    // Sur l'accueil, on défile directement sans recharger la page.
    if (pathname !== '/') return
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

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
        <Link href="/" className="flex items-center gap-2" aria-label="Saveur Béninoise, accueil">
          <span className="grid size-8 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
            S
          </span>
          <span className="whitespace-nowrap font-display text-base font-semibold tracking-tight sm:text-lg">
            Saveur <span className="text-primary">Béninoise</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`${homeHref}#${section.id}`}
              onClick={(event) => scrollToSection(event, section.id)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {section.label}
            </Link>
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
