'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { whatsappLink } from '@/lib/site'
import { WhatsAppIcon } from './whatsapp-icon'

export function FloatingWhatsApp() {
  const { scrollY } = useScroll()
  const [expanded, setExpanded] = useState(true)
  useMotionValueEvent(scrollY, 'change', (y) => setExpanded(y < 400))

  return (
    <motion.a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Commander sur WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.4, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-50 flex h-16 items-center gap-2 rounded-full bg-whatsapp pl-4 pr-4 text-whatsapp-foreground shadow-[0_12px_40px_-6px] shadow-whatsapp/70 ring-4 ring-whatsapp/20 md:bottom-8 md:right-8"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.4s]" aria-hidden="true" />
      <WhatsAppIcon className="size-8 shrink-0" />
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden whitespace-nowrap pr-1 font-semibold"
          >
            Commander
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  )
}
