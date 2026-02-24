import React from 'react'
import './styles.css'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'

export const metadata = {
  description:
    'Perfiles verificados de candidatos presidenciales en Colombia para comparar propuestas y trayectoria con enfoque neutral.',
  title: 'Elecciones Colombia',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Instrument+Serif&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main className="mx-auto min-h-screen max-w-7xl px-6 py-6 md:px-8 lg:px-12">
          <SiteHeader />
          {children}
          <SiteFooter />
        </main>
      </body>
    </html>
  )
}
