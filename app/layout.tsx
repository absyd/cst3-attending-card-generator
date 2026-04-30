import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'CST Tech Titans Trophy Card Generator',
  description: 'Upload your photo and create your personalized CST Tech Titans tournament attending card. Built for the CST3 Tech Titans event.',
  keywords: ['CST Tech Titans', 'CST3', 'Tournament Card', 'Card Generator', 'Tech Titans', 'CST'],
  authors: [{ name: 'Abu Sayed', url: 'https://absyd.xyz' }],
  creator: 'Abu Sayed',
  metadataBase: new URL('https://cst3-card-generator.vercel.app'),
  openGraph: {
    title: 'CST Tech Titans Trophy Card Generator',
    description: 'Create your personalized tournament attending card for CST Tech Titans',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CST Tech Titans Trophy Card Generator',
    description: 'Create your personalized tournament attending card',
  },
  icons: {
    icon: [
      {
        url: '/images/final-logo.png',
        type: 'image/png',
        sizes: 'any',
      },
    ],
    apple: '/images/final-logo.png',
    shortcut: '/images/final-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
