'use client'

import { motion } from 'motion/react'
import { Clock, MapPin, Phone } from 'lucide-react'
import { applyPlaceholders, parseHours, whatsappLinkFor, type SiteContent } from '@/lib/content'
import { RichText } from './rich-text'
import { WhatsAppButton } from './whatsapp-button'

export function SiteFooter({ content }: { content: SiteContent }) {
  const hours = parseHours(content.hours)
  const copyright = applyPlaceholders(content['footer.copyright'], {
    année: String(new Date().getFullYear()),
  })

  return (
    <footer id="infos" className="relative scroll-mt-24 overflow-hidden pb-32 pt-24 md:pb-16 md:pt-32">
      <div aria-hidden="true" className="absolute -left-40 bottom-0 -z-10 size-[30rem] rounded-full bg-primary/10 blur-[140px]" />
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col items-center gap-6 rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/20 via-card to-card p-10 text-center shadow-2xl shadow-black/50 md:p-16"
        >
          <h2 className="text-balance font-display text-4xl font-semibold tracking-tight md:text-6xl">
            <RichText text={content['footer.ctaTitle']} />
          </h2>
          <p className="max-w-md text-lg text-muted-foreground">{content['footer.ctaDescription']}</p>
          <WhatsAppButton href={whatsappLinkFor(content)} />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="overflow-hidden rounded-3xl border border-white/[0.07] shadow-2xl shadow-black/40 lg:col-span-3">
            <iframe
              title="Carte : Saveur Béninoise à Cotonou"
              src={`https://www.google.com/maps?q=${encodeURIComponent(content['contact.mapQuery'])}&output=embed`}
              className="h-80 w-full grayscale invert-[0.9] hue-rotate-180 md:h-full md:min-h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-3xl border border-white/[0.07] bg-card p-7 shadow-2xl shadow-black/40">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Clock className="size-5 text-primary" aria-hidden="true" />
                {content['contact.hoursTitle']}
              </h3>
              {hours.length > 0 ? (
                <dl className="mt-5 space-y-3">
                  {hours.map((entry) => (
                    <div
                      key={entry.days}
                      className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-muted-foreground">{entry.days}</dt>
                      <dd className="font-semibold tabular-nums">{entry.time}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Les horaires sont en cours de mise à jour. Écrivez-nous sur WhatsApp pour connaître nos horaires
                  d&apos;aujourd&apos;hui.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-white/[0.07] bg-card p-7 shadow-2xl shadow-black/40">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
                <MapPin className="size-5 text-primary" aria-hidden="true" />
                {content['contact.findTitle']}
              </h3>
              <address className="mt-4 not-italic leading-relaxed text-muted-foreground">
                {content['contact.addressLine1']}
                <br />
                {content['contact.addressLine2']}
              </address>
              <a
                href={whatsappLinkFor(content)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 font-semibold text-whatsapp hover:underline"
              >
                <Phone className="size-4" aria-hidden="true" />
                {content['contact.phoneDisplay']}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-sm text-muted-foreground md:flex-row">
          <p className="font-display text-base text-foreground">
            Saveur <span className="text-primary">Béninoise</span>
          </p>
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
