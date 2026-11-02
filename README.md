# Saveur Béninoise

Landing page + prise de commande pour le restaurant Saveur Béninoise (Cotonou).
Site en production : <https://saveur-beninoise.vercel.app>

## Ce que fait le site

- **Accueil** : présentation, menu des 6 plats, avis clients, horaires, carte.
- **`/commander`** : formulaire de commande (plat, quantité, nom, téléphone, adresse).
  La commande est **enregistrée en base**, puis **récapitulée automatiquement dans WhatsApp**.
- **`/admin`** : liste des commandes reçues, protégée par mot de passe.
- Partage WhatsApp / réseaux sociaux (image `og-image.jpg`), `robots.txt`, `sitemap.xml`, données structurées `Restaurant`.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Neon Postgres (Vercel Marketplace) + Drizzle ORM
- Images optimisées en WebP (`public/images`, générées par `pnpm images`)

## Développement local

```bash
corepack pnpm install
cp .env.example .env.local   # puis renseigner les variables
corepack pnpm dev
```

Variables d'environnement :

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (SEO, sitemap, partages) |
| `DATABASE_URL` | Connexion Neon (injectée par Vercel) |
| `ADMIN_PASSWORD` | Mot de passe de la page `/admin` |

## Base de données

### 1. Créer la base sur Vercel

1. Ouvrir le projet sur [vercel.com](https://vercel.com) → onglet **Storage**.
2. **Create Database** → **Neon**.
3. Région **Paris / Francfort** (`cdg1`), plan **Free**.
4. **Connect Project** → cocher Production, Preview et Development.

Vercel ajoute alors `DATABASE_URL` au projet.

### 2. Récupérer la variable en local

```bash
vercel env pull .env.local
```

### 3. Créer la table `orders`

```bash
corepack pnpm db:migrate   # applique drizzle/0000_*.sql
```

Autres commandes utiles :

```bash
corepack pnpm db:generate  # génère une migration après modification de lib/schema.ts
corepack pnpm db:studio    # explorateur de base de données
```

### 4. Activer l'espace commandes

Ajouter `ADMIN_PASSWORD` dans les variables d'environnement Vercel, puis redéployer.
La page `/admin` permet de suivre les commandes (nouvelle → confirmée → livrée / annulée).

## Structure utile

```
app/
  page.tsx              accueil
  commander/            formulaire + Server Action createOrder
  admin/                tableau de bord des commandes
  robots.ts, sitemap.ts SEO
components/             UI (header, menu, formulaire, footer…)
lib/
  site.ts               contenu du site (plats, prix, horaires, avis)
  schema.ts             schéma Drizzle (table orders)
  db.ts                 connexion Neon paresseuse
  admin-auth.ts         session admin signée (cookie HTTP-only)
drizzle/                migrations SQL
scripts/optimize-images.mjs  conversion WebP + image de partage
```

## Régénérer les images

Le script attend les fichiers sources dans `public/images` (`hero.png`, `amiwo.png`, …).
Ils sont récupérables depuis le premier commit :

```bash
git checkout b0ca237 -- public/images
corepack pnpm images
```
