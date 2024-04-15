import { Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'
import Loading from './loading'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UJED - Gestión de Minutas',
  description: 'Gestión de Minutas - UJED',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Suspense fallback={<Loading/>}>
          {children}
        </Suspense>
        </body>
    </html>
  )
}
