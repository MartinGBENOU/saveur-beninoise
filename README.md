# Saveur Béninoise

Landing page + prise de commande pour le restaurant Saveur Béninoise (Cotonou).
Site en production : <https://saveur-beninoise.vercel.app>

## Ce que fait le site

- **Accueil** : présentation, carte du restaurant, avis clients, horaires.
- **`/commander`** : formulaire de commande (plat, quantité, nom, téléphone, adresse).
  La commande est **enregistrée en base**, puis **récapitulée automatiquement dans WhatsApp**.
- **Avis clients** : n'importe quel visiteur peut laisser un avis depuis l'accueil, sans créer de compte.
  L'avis est enregistré **en attente** et n'apparaît sur le site qu'après validation dans `/admin/avis`.
- **`/admin`** : liste des commandes reçues, protégée par mot de passe.
- **`/admin/menu`** : gestion de la carte (nom, description, prix, photo, badge, disponibilité, ordre).
  La photo peut être **envoyée depuis le téléphone ou l'ordinateur** : elle est réduite automatiquement
  dans le navigateur (1400 px, WebP, moins de 900 Ko) puis enregistrée avec le plat.
- **`/admin/avis`** : relire les avis reçus, les publier, les retirer ou les supprimer.
- **`/admin/texte`** : modifier **tous les textes du site** (accueil, carte, avis, horaires, contact, SEO…).
  Les changements sont visibles immédiatement ; un bouton permet de restaurer les textes d'origine.
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

### 3. Créer les tables

```bash
corepack pnpm db:migrate   # applique 0000 (orders), 0001 (dishes) puis 0002 (settings, testimonials, uploads)
```

Autres commandes utiles :

```bash
corepack pnpm db:generate  # génère une migration après modification de lib/schema.ts
corepack pnpm db:studio    # explorateur de base de données
```

### 4. Activer l'espace d'administration

Ajouter `ADMIN_PASSWORD` dans les variables d'environnement Vercel, puis redéployer.

- `/admin` : suivre les commandes (nouvelle → confirmée → livrée / annulée).
- `/admin/menu` : modifier la carte. Un plat décoché « Disponible » disparaît du site public et
  ne peut plus être commandé. Vous pouvez envoyer votre propre photo : elle remplace l'ancienne.
- `/admin/avis` : publier, retirer ou supprimer les avis clients.
- `/admin/texte` : modifier les textes et les horaires. Les champs laissés à leur valeur d'origine ne
  sont pas stockés en base ; « Restaurer les textes d'origine » efface toutes les personnalisations.

Le menu de secours (`lib/site.ts`) est utilisé si la base est vide ou injoignable ; il sert aussi
de source pour « Restaurer le menu de départ » quand la carte est vide. Les textes de secours sont
dans `lib/content.ts`.

### 5. Stockage des photos

Les photos envoyées depuis `/admin/menu` sont stockées **dans la table `uploads`** (base64) et servies
par `/api/uploads/[id]`, avec un cache long. Aucun service de stockage externe n'est nécessaire.
Elles sont supprimées automatiquement quand le plat est supprimé ou quand la photo est remplacée.
La taille du corps des Server Actions est limitée à **4 Mo** dans `next.config.mjs`, d'où la
compression dans le navigateur avant l'envoi.

## Structure utile

```
app/
  page.tsx              accueil (carte, textes et avis lus en base, revalidation à la demande)
  avis/actions.ts       Server Action submitReview (avis d'un visiteur)
  api/uploads/[id]/     service des photos de plats stockées en base
  commander/            formulaire + Server Action createOrder
  admin/                tableau de bord des commandes
  admin/menu/           gestion de la carte (Server Actions CRUD + envoi de photo)
  admin/avis/           modération des avis clients
  admin/texte/          édition et restauration des textes
  robots.ts, sitemap.ts SEO
components/             UI (header, menu, formulaire, avis, footer…)
lib/
  site.ts               constantes + menu de secours et avis d'origine
  content.ts            textes par défaut, groupes de champs admin, horaires, helpers
  content-server.ts     lecture des textes personnalisés (table settings)
  reviews.ts            lecture des avis (publiés / tous) + repli
  uploads.ts            enregistrement et suppression des photos en base
  menu.ts               lecture de la carte en base + photos disponibles
  schema.ts             schéma Drizzle (orders, dishes, settings, testimonials, uploads)
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
