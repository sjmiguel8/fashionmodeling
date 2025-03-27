import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t">
            <div className="container flex flex-col gap-2 sm:flex-row py-6 px-4 md:px-6">
              <p className="text-xs text-muted-foreground">© 2023 FashionFit. All rights reserved.</p>
              <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <Link className="text-xs hover:underline underline-offset-4" href="#">
                  Terms of Service
                </Link>
                <Link className="text-xs hover:underline underline-offset-4" href="#">
                  Privacy
                </Link>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
