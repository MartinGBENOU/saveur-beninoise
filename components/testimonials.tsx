'use client'

import { motion } from 'motion/react'
import { Quote, Star } from 'lucide-react'
import { testimonials } from '@/lib/site'
import { SectionHeading } from './section-heading'

export function Testimonials() {
  return (
    <section id="avis" aria-labelledby="avis-title" className="relative scroll-mt-24 border-y border-white/[0.06] bg-card/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="avis-title"
          eyebrow="Avis clients"
          title={
            <>
              Ils en parlent <span className="italic text-primary">mieux</span> que nous
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col rounded-3xl border border-white/[0.07] bg-gradient-to-b from-card to-background p-8 shadow-2xl shadow-black/40"
            >
              <Quote className="absolute right-6 top-6 size-10 text-primary/15" aria-hidden="true" />
              <div className="flex gap-1" role="img" aria-label={`${t.rating} étoiles sur 5`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    aria-hidden="true"
                    className={s < t.rating ? 'size-5 fill-primary text-primary' : 'size-5 text-muted'}
                  />
                ))}
              </div>
              <blockquote className="mt-6 flex-1 text-pretty text-lg leading-relaxed">
                {`« ${t.quote} »`}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-white/[0.07] pt-6">
                <span className="grid size-11 place-items-center rounded-full bg-primary/15 font-display font-semibold text-primary">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold">{t.name}</span>
                  <span className="block text-sm text-muted-foreground">{t.location}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
