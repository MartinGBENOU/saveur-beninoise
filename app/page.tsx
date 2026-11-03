import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { Hero } from '@/components/hero'
import { MenuSection } from '@/components/menu-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { StructuredData } from '@/components/structured-data'
import { Testimonials } from '@/components/testimonials'
import { whatsappLinkFor } from '@/lib/content'
import { getContent } from '@/lib/content-server'
import { getMenu } from '@/lib/menu'
import { getApprovedReviews } from '@/lib/reviews'

// La carte, les textes et les avis sont mis à jour à la demande depuis l'admin (revalidatePath).
// Ce délai n'est qu'un filet de sécurité si la revalidation n'a pas pu être déclenchée.
export const revalidate = 300

export default async function Page() {
  const [menu, content, reviews] = await Promise.all([getMenu(), getContent(), getApprovedReviews()])

  return (
    <>
      <StructuredData dishes={menu} content={content} />
      <SiteHeader content={content} />
      <main>
        <Hero content={content} />
        <MenuSection dishes={menu} content={content} />
        <Testimonials content={content} reviews={reviews} />
      </main>
      <SiteFooter content={content} />
      <FloatingWhatsApp href={whatsappLinkFor(content)} label={content['nav.order']} />
    </>
  )
}
