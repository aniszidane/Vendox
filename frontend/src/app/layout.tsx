// VendoX Frontend — app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Outfit, DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'VendoX — Your Local Market, Reimagined', template: '%s | VendoX' },
  description: 'Discover stores, products, and services around you. VendoX is your local social-commerce marketplace.',
  keywords: ['marketplace', 'local', 'stores', 'shopping', 'Algeria', 'VendoX'],
  authors: [{ name: 'VendoX Team' }],
  creator: 'VendoX',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vendox.dz',
    siteName: 'VendoX',
    title: 'VendoX — Your Local Market, Reimagined',
    description: 'Discover stores, products, and services around you.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VendoX — Your Local Market, Reimagined',
    creator: '@vendoxdz',
  },
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D7490',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
