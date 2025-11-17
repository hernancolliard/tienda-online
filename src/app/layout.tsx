import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Providers from './providers';

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
        <Providers>
          <Sidebar />
          <Header />
          <div className="main-content transition-all duration-300 pt-20">
            <main className="flex-grow min-h-screen p-8">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
