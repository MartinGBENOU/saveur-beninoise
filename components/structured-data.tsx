import { SITE_URL } from '@/lib/site'
import { whatsappNumber, type SiteContent } from '@/lib/content'
import type { MenuDish } from '@/lib/menu'

const openingHours = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '11:00',
    closes: '23:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Friday', 'Saturday'],
    opens: '11:00',
    closes: '01:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Sunday'],
    opens: '12:00',
    closes: '22:00',
  },
]

const menuItems = (dishes: MenuDish[]) =>
  dishes.map((dish) => ({
    '@type': 'MenuItem',
    name: dish.name,
    description: dish.description,
    image: /^https?:\/\//.test(dish.image) ? dish.image : `${SITE_URL}${dish.image}`,
    offers: {
      '@type': 'Offer',
      price: String(dish.price),
      priceCurrency: 'XOF',
    },
  }))

export function StructuredData({ dishes, content }: { dishes: MenuDish[]; content: SiteContent }) {
  const city = content['contact.addressLine2'].split(',')[0]?.trim() || 'Cotonou'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Saveur Béninoise',
    description: content['seo.description'],
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/icon.svg`,
    telephone: `+${whatsappNumber(content)}`,
    priceRange: '2000-4500 FCFA',
    currenciesAccepted: 'XOF',
    paymentAccepted: 'Espèces, Mobile Money',
    servesCuisine: ['Béninoise', 'Africaine', 'Street food'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: content['contact.addressLine1'],
      addressLocality: city,
      addressCountry: 'BJ',
    },
    areaServed: {
      '@type': 'City',
      name: 'Cotonou',
    },
    openingHoursSpecification: openingHours,
    hasMenu: {
      '@type': 'Menu',
      name: 'Menu Saveur Béninoise',
      url: `${SITE_URL}/#menu`,
      hasMenuSection: {
        '@type': 'MenuSection',
        name: content['menu.eyebrow'],
        hasMenuItem: menuItems(dishes),
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
