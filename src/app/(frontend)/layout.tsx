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
      <body>
        <main className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </main>
      </body>
    </html>
  )
}
