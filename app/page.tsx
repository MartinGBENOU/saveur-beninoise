import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { Hero } from '@/components/hero'
import { MenuSection } from '@/components/menu-section'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { StructuredData } from '@/components/structured-data'
import { Testimonials } from '@/components/testimonials'

export default function Page() {
  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main>
        <Hero />
        <MenuSection />
        <Testimonials />
      </main>
      <SiteFooter />
      <FloatingWhatsApp />
    </>
  )
}
