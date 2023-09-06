import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-slate-50 flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
