'use client'

import { motion } from 'motion/react'

export function SectionHeading({ eyebrow, title, description, id }: { eyebrow: string; title: React.ReactNode; description?: string; id?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mb-12 max-w-2xl text-center md:mb-16"
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h2 id={id} className="text-balance font-display text-4xl font-semibold tracking-tight md:text-6xl">
        {title}
      </h2>
      {description && <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">{description}</p>}
    </motion.div>
  )
}
