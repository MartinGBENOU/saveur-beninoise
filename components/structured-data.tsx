import { dishes, SITE_URL, WHATSAPP_NUMBER } from '@/lib/site'

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

const menuItems = dishes.map((dish) => ({
  '@type': 'MenuItem',
  name: dish.name,
  description: dish.description,
  image: `${SITE_URL}${dish.image}`,
  offers: {
    '@type': 'Offer',
    price: String(dish.price),
    priceCurrency: 'XOF',
  },
}))

export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Saveur Béninoise',
    description:
      'Street food béninoise authentique : poulet braisé, amiwo, alloco, brochettes et poisson braisé, préparés à la braise et livrés chauds à Cotonou.',
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/icon.svg`,
    telephone: `+${WHATSAPP_NUMBER}`,
    priceRange: '2000-4500 FCFA',
    currenciesAccepted: 'XOF',
    paymentAccepted: 'Espèces, Mobile Money',
    servesCuisine: ['Béninoise', 'Africaine', 'Street food'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue 12.054, Haie Vive',
      addressLocality: 'Cotonou',
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
        name: 'Nos best-sellers',
        hasMenuItem: menuItems,
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
