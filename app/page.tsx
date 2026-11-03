import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { Hero } from '@/components/hero'
import { MenuSection } from '@/components/menu-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { StructuredData } from '@/components/structured-data'
import { Testimonials } from '@/components/testimonials'
import { getMenu } from '@/lib/menu'

// La carte est mise à jour à la demande depuis /admin/menu (revalidatePath).
// Ce délai n'est qu'un filet de sécurité si la revalidation n'a pas pu être déclenchée.
export const revalidate = 300

export default async function Page() {
  const menu = await getMenu()

  return (
    <>
      <StructuredData dishes={menu} />
      <SiteHeader />
      <main>
        <Hero />
        <MenuSection dishes={menu} />
        <Testimonials />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
    </>
  )
}
