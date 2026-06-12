import Providers from './providers'
import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Trading Journal',
  description: 'Professional trading journal to track, analyze and improve your trades',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
          <Providers>
        <div className="min-h-screen bg-tv-bg">
          <Navigation />
          <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>
        </div>
          </Providers>
    </body>
    </html>
  )
}
