import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hypeworks A+ Content Funnel',
  description: 'Generate AI-powered A+ content for Amazon listings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
