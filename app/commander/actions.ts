'use server'

import { redirect } from 'next/navigation'
import { whatsappLinkFor } from '@/lib/content'
import { getContent } from '@/lib/content-server'
import { getDb } from '@/lib/db'
import { getDishBySlug } from '@/lib/menu'
import { orders } from '@/lib/schema'
import { formatFCFA } from '@/lib/site'

const PHONE_PATTERN = /^\+?[0-9][0-9\s.-]{6,19}$/

function readText(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function createOrder(_previousState: { error: string } | null, formData: FormData) {
  const customerName = readText(formData, 'name')
  const phone = readText(formData, 'phone')
  const dishSlug = readText(formData, 'dish')
  const address = readText(formData, 'address')
  const notes = readText(formData, 'notes')
  const quantity = Number.parseInt(readText(formData, 'quantity'), 10)

  // Le prix est toujours relu en base : un visiteur ne peut pas le modifier.
  const dish = await getDishBySlug(dishSlug)

  if (customerName.length < 2 || customerName.length > 80) {
    return { error: 'Indiquez votre nom (2 à 80 caractères).' }
  }
  if (!PHONE_PATTERN.test(phone)) {
    return { error: 'Indiquez un numéro de téléphone valide (ex. 01 99 56 11 44).' }
  }
  if (!dish || !dish.available) {
    return { error: "Ce plat n'est plus disponible. Choisissez-en un autre ou écrivez-nous sur WhatsApp." }
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    return { error: 'La quantité doit être comprise entre 1 et 20.' }
  }
  if (address.length < 5 || address.length > 200) {
    return { error: "Indiquez une adresse de livraison précise (quartier, rue, repère)." }
  }
  if (notes.length > 500) {
    return { error: 'Les précisions sont limitées à 500 caractères.' }
  }

  const total = dish.price * quantity

  let reference: string | null = null

  try {
    const [created] = await getDb()
      .insert(orders)
      .values({
        customerName,
        phone,
        dish: dish.name,
        quantity,
        unitPrice: dish.price,
        total,
        address,
        notes: notes || null,
      })
      .returning({ id: orders.id })

    reference = created?.id.slice(0, 8).toUpperCase() ?? null
  } catch (error) {
    // Une panne de base ne doit jamais empêcher une commande de partir sur WhatsApp.
    console.error('[orders] enregistrement impossible :', error)
  }

  const lines = [
    'Bonjour Saveur Béninoise ! Je souhaite commander :',
    '',
    `• ${quantity} × ${dish.name} — ${formatFCFA(total)}`,
    `Nom : ${customerName}`,
    `Téléphone : ${phone}`,
    `Adresse : ${address}`,
    notes ? `Précisions : ${notes}` : null,
    reference ? `Réf. commande : ${reference}` : null,
  ].filter((line): line is string => line !== null)

  redirect(whatsappLinkFor(await getContent(), lines.join('\n')))
}
