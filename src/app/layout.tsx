import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'A+ Content Studio',
  description: 'Generate premium Amazon A+ modules with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{const saved=localStorage.getItem('theme');if(saved==='dark'){document.documentElement.classList.add('dark');return;}if(saved==='light'){document.documentElement.classList.remove('dark');return;}if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark');}}catch(e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  )
}
