import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold">FashionFit</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="font-medium text-primary">
            Home
          </Link>
          <Link href="/search" className="font-medium text-muted-foreground hover:text-primary">
            Search
          </Link>
          <Link href="/saved" className="font-medium text-muted-foreground hover:text-primary">
            Saved Items
          </Link>
          <Link href="/mannequin" className="font-medium text-muted-foreground hover:text-primary">
            Try On
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
