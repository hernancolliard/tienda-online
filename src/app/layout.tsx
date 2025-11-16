import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tu Tienda Online',
  description: 'Los mejores productos, en un solo lugar.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <div className="ml-20 transition-all duration-300">
          <main className="flex-grow min-h-screen p-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
