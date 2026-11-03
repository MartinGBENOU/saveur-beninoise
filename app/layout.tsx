import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { getContent } from '@/lib/content-server'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent()
  const title = content['seo.title']
  const description = content['seo.description']

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: 'Saveur Béninoise',
    authors: [{ name: 'Saveur Béninoise' }],
    creator: 'Saveur Béninoise',
    category: 'restaurant',
    keywords: [
      'saveur béninoise',
      'poulet braisé Cotonou',
      'amiwo',
      'alloco',
      'street food Bénin',
      'livraison Cotonou',
      'commander sur WhatsApp',
      'restaurant béninois',
    ],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'fr_BJ',
      url: '/',
      siteName: 'Saveur Béninoise',
      title,
      description,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    icons: {
      icon: [
        { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
        { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#16120f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
