'use client'

import { motion } from 'motion/react'
import { MessageSquarePlus, Quote, Star } from 'lucide-react'
import type { SiteContent } from '@/lib/content'
import type { Review } from '@/lib/reviews'
import { ReviewForm } from './review-form'
import { RichText } from './rich-text'
import { SectionHeading } from './section-heading'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, s) => (
        <Star
          key={s}
          aria-hidden="true"
          className={s < rating ? 'size-5 fill-primary text-primary' : 'size-5 text-muted'}
        />
      ))}
    </div>
  )
}

export function Testimonials({ content, reviews }: { content: SiteContent; reviews: Review[] }) {
  return (
    <section id="avis" aria-labelledby="avis-title" className="relative scroll-mt-24 border-y border-white/[0.06] bg-card/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          id="avis-title"
          eyebrow={content['reviews.eyebrow']}
          title={<RichText text={content['reviews.title']} />}
        />

        {reviews.length === 0 ? (
          <p className="mx-auto max-w-xl rounded-3xl border border-white/[0.07] bg-card px-6 py-10 text-center text-muted-foreground">
            {content['reviews.empty']}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review, i) => (
              <motion.figure
                key={review.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col rounded-3xl border border-white/[0.07] bg-gradient-to-b from-card to-background p-8 shadow-2xl shadow-black/40"
              >
                <Quote className="absolute right-6 top-6 size-10 text-primary/15" aria-hidden="true" />
                <Stars rating={review.rating} />
                <blockquote className="mt-6 flex-1 text-pretty text-lg leading-relaxed">
                  {`« ${review.quote} »`}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-white/[0.07] pt-6">
                  <span className="grid size-11 place-items-center rounded-full bg-primary/15 font-display font-semibold text-primary">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                  <span>
                    <span className="block font-semibold">{review.name}</span>
                    {review.location && <span className="block text-sm text-muted-foreground">{review.location}</span>}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <a
            href="#laisser-un-avis"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <MessageSquarePlus className="size-4" aria-hidden="true" />
            {content['reviews.cta']}
          </a>
        </div>

        <div
          id="laisser-un-avis"
          className="mt-14 grid scroll-mt-24 gap-8 rounded-[2rem] border border-white/[0.07] bg-gradient-to-br from-primary/10 via-card to-card p-7 shadow-2xl shadow-black/40 md:grid-cols-[0.85fr_1.15fr] md:p-10"
        >
          <div>
            <h3 className="font-display text-3xl font-semibold tracking-tight">{content['reviews.formTitle']}</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">{content['reviews.formDescription']}</p>
          </div>
          <ReviewForm content={content} />
        </div>
      </div>
    </section>
  )
}
