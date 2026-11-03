import Link from 'next/link'

const links = [
  { href: '/admin', label: 'Commandes', key: 'orders' },
  { href: '/admin/menu', label: 'Carte du menu', key: 'menu' },
  { href: '/admin/avis', label: 'Avis clients', key: 'reviews' },
  { href: '/admin/texte', label: 'Textes du site', key: 'content' },
] as const

export type AdminSection = (typeof links)[number]['key']

export function AdminNav({ current }: { current: AdminSection }) {
  return (
    <nav aria-label="Sections de l’espace admin" className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = link.key === current
        return (
          <Link
            key={link.key}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'border border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
