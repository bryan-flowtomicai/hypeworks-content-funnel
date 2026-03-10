import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hypeworks — AI-Powered A+ Content Generator',
  description:
    'Generate professional Amazon A+ content with AI. Transform your product listings with stunning, brand-consistent imagery.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
