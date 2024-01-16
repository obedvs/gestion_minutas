// import Favicon from '/public/favicon.ico';

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UJED - Gestión de Minutas',
  description: 'Gestión de Minutas - UJED',
  // icons: [{ rel: 'icon', url: Favicon.src }],
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className} suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
