import Head from 'next/head'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PawFinder',
  description: 'Created by Hunter Samoy as a take home assignment for Fetch.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={inter.className}>
        {children}
        <footer className="text-center">
            <p className="text-[#1b191b] opacity-90 text-sm">Copyright &copy; 2023 Hunter Samoy</p>
        </footer>
        </body>
    </html>
  )
}
