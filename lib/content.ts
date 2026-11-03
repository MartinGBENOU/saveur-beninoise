export const defaultContent = {
  // Accueil
  'hero.badge': 'Cuisiné à la braise, chaque jour à Cotonou',
  'hero.titleLine1': 'Le Goût',
  'hero.titleLine2': 'du Bénin,',
  'hero.titleAccent': 'Livré Chaud',
  'hero.description':
    'Poulet braisé, amiwo, alloco… Les recettes authentiques de nos mamans, préparées avec passion et livrées fumantes à votre porte.',
  'hero.primaryCta': 'Commander sur WhatsApp',
  'hero.secondaryCta': 'Voir le menu',
  'hero.rating': '4,9/5',
  'hero.ratingNote': '· 1 200+ avis',
  'hero.delivery': '30 min',
  'hero.deliveryNote': '· livraison',

  // Navigation
  'nav.menu': 'Menu',
  'nav.reviews': 'Avis',
  'nav.infos': 'Infos',
  'nav.order': 'Commander',

  // Carte
  'menu.eyebrow': 'Nos best-sellers',
  'menu.title': 'Les plats qu’on *s’arrache*',
  'menu.description':
    '{nombre} recettes signatures, préparées chaque jour avec des produits frais du marché Dantokpa.',
  'menu.note': 'Livraison offerte dès 10 000 F · Paiement à la livraison ou MoMo',
  'menu.cta': 'Commander ce plat',
  'menu.empty':
    "La carte est en cours de mise à jour. Écrivez-nous sur WhatsApp, nous vous disons ce qui est disponible aujourd'hui.",

  // Avis
  'reviews.eyebrow': 'Avis clients',
  'reviews.title': 'Ils en parlent *mieux* que nous',
  'reviews.formTitle': 'Laissez votre avis',
  'reviews.formDescription':
    "Vous avez commandé chez nous ? Dites-nous ce que vous en avez pensé. Votre avis sera publié après vérification.",
  'reviews.nameLabel': 'Votre prénom',
  'reviews.locationLabel': 'Votre quartier',
  'reviews.ratingLabel': 'Votre note',
  'reviews.quoteLabel': 'Votre avis',
  'reviews.submit': 'Envoyer mon avis',
  'reviews.thanks': 'Merci ! Votre avis a bien été reçu. Il sera publié après validation.',
  'reviews.empty': 'Les premiers avis arrivent bientôt.',
  'reviews.cta': 'Laisser un avis',

  // Contact et horaires
  hours: 'Lundi – Jeudi | 11h00 – 23h00\nVendredi – Samedi | 11h00 – 01h00\nDimanche | 12h00 – 22h00',
  'contact.hoursTitle': 'Horaires',
  'contact.findTitle': 'Nous trouver',
  'contact.addressLine1': 'Rue 12.054, Haie Vive',
  'contact.addressLine2': 'Cotonou, Bénin',
  'contact.phoneDisplay': '+229 01 99 56 11 44',
  'contact.phoneNumber': '2290199561144',
  'contact.mapQuery': 'Haie Vive, Cotonou, Benin',

  // Pied de page
  'footer.ctaTitle': 'Une petite faim *?*',
  'footer.ctaDescription': "Envoyez-nous un message, on s'occupe du reste. Livré chaud en 30 minutes.",
  'footer.copyright': '© {année} Saveur Béninoise. Fait avec amour à Cotonou.',

  // Page de commande
  'order.eyebrow': 'Commande en ligne',
  'order.title': 'On prépare, vous *dégustez*.',
  'order.description':
    'Remplissez ce formulaire : votre commande est enregistrée, puis récapitulée automatiquement dans WhatsApp pour confirmation. Livraison chaude en 30 minutes à Cotonou.',
  'order.note':
    'Votre commande est enregistrée, puis récapitulée dans WhatsApp. Livraison offerte dès 10 000 F.',
  'order.submit': 'Valider et envoyer sur WhatsApp',

  // WhatsApp
  'whatsapp.message': 'Bonjour Saveur Béninoise ! Je souhaite passer une commande.',

  // Référencement
  'seo.title': 'Saveur Béninoise — Le Goût du Bénin, Livré Chaud',
  'seo.description':
    'Poulet braisé, amiwo, alloco, brochettes… La street food béninoise authentique, préparée à la braise et livrée chaude à Cotonou. Commandez sur WhatsApp.',
} as const

export type ContentKey = keyof typeof defaultContent
export type SiteContent = Record<ContentKey, string>

export const defaultSiteContent: SiteContent = { ...defaultContent }

export type ContentField = {
  key: ContentKey
  label: string
  type: 'text' | 'textarea'
  help?: string
}

export const contentGroups: {
  id: string
  title: string
  description?: string
  fields: ContentField[]
}[] = [
  {
    id: 'accueil',
    title: 'Page d’accueil',
    description: 'Le grand titre, l’accroche et les repères affichés en haut du site.',
    fields: [
      { key: 'hero.badge', label: 'Bandeau au-dessus du titre', type: 'text' },
      { key: 'hero.titleLine1', label: 'Titre — ligne 1', type: 'text' },
      { key: 'hero.titleLine2', label: 'Titre — ligne 2', type: 'text' },
      { key: 'hero.titleAccent', label: 'Titre — ligne colorée', type: 'text' },
      { key: 'hero.description', label: 'Texte de présentation', type: 'textarea' },
      { key: 'hero.primaryCta', label: 'Bouton WhatsApp', type: 'text' },
      { key: 'hero.secondaryCta', label: 'Bouton secondaire', type: 'text' },
      { key: 'hero.rating', label: 'Note affichée', type: 'text' },
      { key: 'hero.ratingNote', label: 'Précision de la note', type: 'text' },
      { key: 'hero.delivery', label: 'Délai de livraison', type: 'text' },
      { key: 'hero.deliveryNote', label: 'Précision du délai', type: 'text' },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    fields: [
      { key: 'nav.menu', label: 'Lien « carte »', type: 'text' },
      { key: 'nav.reviews', label: 'Lien « avis »', type: 'text' },
      { key: 'nav.infos', label: 'Lien « infos »', type: 'text' },
      { key: 'nav.order', label: 'Bouton de commande', type: 'text' },
    ],
  },
  {
    id: 'carte',
    title: 'Section carte',
    description:
      'Astuce : {nombre} est remplacé par le nombre de plats, et *un texte* s’affiche en italique coloré.',
    fields: [
      { key: 'menu.eyebrow', label: 'Sur-titre', type: 'text' },
      { key: 'menu.title', label: 'Titre de la section', type: 'text' },
      { key: 'menu.description', label: 'Description', type: 'textarea' },
      { key: 'menu.note', label: 'Note sous le bouton', type: 'text' },
      { key: 'menu.cta', label: 'Bouton de chaque plat', type: 'text' },
      { key: 'menu.empty', label: 'Message si la carte est vide', type: 'textarea' },
    ],
  },
  {
    id: 'avis',
    title: 'Section avis',
    fields: [
      { key: 'reviews.eyebrow', label: 'Sur-titre', type: 'text' },
      { key: 'reviews.title', label: 'Titre de la section', type: 'text' },
      { key: 'reviews.formTitle', label: 'Titre du formulaire', type: 'text' },
      { key: 'reviews.formDescription', label: 'Texte du formulaire', type: 'textarea' },
      { key: 'reviews.nameLabel', label: 'Champ « prénom »', type: 'text' },
      { key: 'reviews.locationLabel', label: 'Champ « quartier »', type: 'text' },
      { key: 'reviews.ratingLabel', label: 'Champ « note »', type: 'text' },
      { key: 'reviews.quoteLabel', label: 'Champ « avis »', type: 'text' },
      { key: 'reviews.submit', label: 'Bouton d’envoi', type: 'text' },
      { key: 'reviews.thanks', label: 'Message de remerciement', type: 'textarea' },
      { key: 'reviews.empty', label: 'Message si aucun avis', type: 'text' },
      { key: 'reviews.cta', label: 'Bouton « laisser un avis »', type: 'text' },
    ],
  },
  {
    id: 'contact',
    title: 'Horaires et contact',
    description: 'Une ligne par créneau, au format « Jours | Horaires ».',
    fields: [
      { key: 'hours', label: 'Horaires d’ouverture', type: 'textarea' },
      { key: 'contact.hoursTitle', label: 'Titre « horaires »', type: 'text' },
      { key: 'contact.findTitle', label: 'Titre « nous trouver »', type: 'text' },
      { key: 'contact.addressLine1', label: 'Adresse — ligne 1', type: 'text' },
      { key: 'contact.addressLine2', label: 'Adresse — ligne 2', type: 'text' },
      { key: 'contact.phoneDisplay', label: 'Téléphone affiché', type: 'text' },
      {
        key: 'contact.phoneNumber',
        label: 'Numéro WhatsApp (indicatif inclus, sans +)',
        type: 'text',
        help: 'Exemple : 2290199561144',
      },
      { key: 'contact.mapQuery', label: 'Recherche sur la carte', type: 'text' },
    ],
  },
  {
    id: 'pied-de-page',
    title: 'Pied de page',
    fields: [
      { key: 'footer.ctaTitle', label: 'Titre de l’encart', type: 'text' },
      { key: 'footer.ctaDescription', label: 'Texte de l’encart', type: 'textarea' },
      {
        key: 'footer.copyright',
        label: 'Mention de copyright',
        type: 'text',
        help: '{année} est remplacé par l’année en cours.',
      },
    ],
  },
  {
    id: 'commande',
    title: 'Page de commande',
    fields: [
      { key: 'order.eyebrow', label: 'Sur-titre', type: 'text' },
      { key: 'order.title', label: 'Titre', type: 'text' },
      { key: 'order.description', label: 'Description', type: 'textarea' },
      { key: 'order.note', label: 'Note sous le bouton', type: 'text' },
      { key: 'order.submit', label: 'Bouton d’envoi', type: 'text' },
    ],
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    fields: [
      {
        key: 'whatsapp.message',
        label: 'Message pré-rempli',
        type: 'textarea',
        help: 'Texte qui apparaît quand le client clique sur un bouton WhatsApp.',
      },
    ],
  },
  {
    id: 'seo',
    title: 'Référencement (Google, WhatsApp)',
    description: 'Titre et description utilisés par Google et dans les partages.',
    fields: [
      { key: 'seo.title', label: 'Titre de la page', type: 'text' },
      { key: 'seo.description', label: 'Description', type: 'textarea' },
    ],
  },
]

export const contentFieldByKey = new Map<ContentKey, ContentField>(
  contentGroups.flatMap((group) => group.fields.map((field) => [field.key, field] as const)),
)

/** Remplace {nombre}, {année}, etc. dans un texte. */
export function applyPlaceholders(value: string, variables: Record<string, string>) {
  return value.replace(/\{([^}]+)\}/g, (match, key: string) => variables[key.trim()] ?? match)
}

/** « Lundi – Jeudi | 11h00 – 23h00 » → { days, time } */
export function parseHours(value: string): { days: string; time: string }[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [days, time] = line.split('|')
      if (!days || !time) return null
      return { days: days.trim(), time: time.trim() }
    })
    .filter((entry): entry is { days: string; time: string } => entry !== null)
}

export function whatsappNumber(content: SiteContent) {
  return content['contact.phoneNumber'].replace(/[^0-9]/g, '')
}

export function whatsappLinkFor(content: SiteContent, message?: string) {
  const text = message ?? content['whatsapp.message']
  return `https://wa.me/${whatsappNumber(content)}?text=${encodeURIComponent(text)}`
}
