export const WHATSAPP_NUMBER = '2290199561144'
export const WHATSAPP_DISPLAY = '+229 01 99 56 11 44'

export function whatsappLink(message = 'Bonjour Saveur Béninoise ! Je souhaite passer une commande.') {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export type Dish = {
  name: string
  description: string
  price: number
  image: string
  tag?: string
}

export const dishes: Dish[] = [
  {
    name: 'Poulet Braisé',
    description: 'Poulet bicyclette mariné 12h, grillé au feu de bois, oignons et piment frais.',
    price: 3500,
    image: '/images/poulet-braise-unsplash.jpg',
    tag: 'N°1 des ventes',
  },
  {
    name: 'Amiwo au Poulet',
    description: 'Pâte rouge de maïs parfumée à la tomate, poulet frit et sauce pimentée maison.',
    price: 3000,
    image: '/images/amiwo.png',
  },
  {
    name: 'Alloco & Poisson',
    description: 'Bananes plantains dorées, poisson grillé et notre sauce piment secrète.',
    price: 2500,
    image: '/images/alloco-unsplash.jpg',
    tag: 'Coup de cœur',
  },
  {
    name: 'Pâte & Sauce Arachide',
    description: 'Pâte blanche onctueuse, sauce arachide mijotée au bœuf tendre.',
    price: 2500,
    image: '/images/sauce-arachide.png',
  },
  {
    name: 'Brochettes de Bœuf',
    description: 'Bœuf épicé au kankankan, grillé à la braise, servi avec oignons crus.',
    price: 2000,
    image: '/images/brochettes.png',
  },
  {
    name: 'Poisson Braisé',
    description: 'Tilapia entier braisé, tomates fraîches, oignons et attiéké.',
    price: 4500,
    image: '/images/poisson-braise-unsplash.jpg',
    tag: 'Premium',
  },
]

export type Testimonial = {
  name: string
  location: string
  rating: number
  quote: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Afiavi K.',
    location: 'Cotonou, Haie Vive',
    rating: 5,
    quote:
      'Le meilleur poulet braisé de Cotonou, sans hésiter. Livré encore fumant en moins de 30 minutes. On commande chaque vendredi !',
  },
  {
    name: 'Rodrigue A.',
    location: 'Calavi',
    rating: 5,
    quote:
      "L'amiwo me rappelle celui de ma grand-mère. Les portions sont généreuses et la commande WhatsApp est ultra simple.",
  },
  {
    name: 'Mireille D.',
    location: 'Cotonou, Fidjrossè',
    rating: 5,
    quote:
      'Présentation soignée, saveurs authentiques, service impeccable. On sent la qualité dans chaque bouchée. Je recommande à 100 %.',
  },
]

export const hours = [
  { days: 'Lundi – Jeudi', time: '11h00 – 23h00' },
  { days: 'Vendredi – Samedi', time: '11h00 – 01h00' },
  { days: 'Dimanche', time: '12h00 – 22h00' },
]

export function formatFCFA(value: number) {
  return `${new Intl.NumberFormat('fr-FR').format(value).replace(/\u202f|\u00a0/g, ' ')} F`
}
