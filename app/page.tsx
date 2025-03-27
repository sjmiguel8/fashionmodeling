import Link from "next/link"
import { Button } from "@/components/ui/button"

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-primary"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const SaveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-primary"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
)

const TryOnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-primary"
  >
    <path d="M21 8a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1z" />
    <path d="M11 3v8l2.5-1.5L16 11V3" />
  </svg>
)

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Visualize Your Perfect Outfit</h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Find, save, and visualize clothing on a 3D mannequin customized to your body shape.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/search">Start Searching</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/mannequin">Try On Clothes</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-video overflow-hidden rounded-xl">
                <img
                  alt="App preview showing a 3D mannequin with clothing"
                  className="object-cover w-full h-full"
                  src="/placeholder.svg?height=500&width=800"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our app makes it easy to find your perfect style with just a few clicks.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="p-2 bg-primary/10 rounded-full">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <SearchIcon />
                  </div>
                </div>
                <h3 className="text-xl font-bold">Search</h3>
                <p className="text-muted-foreground text-center">
                  Find clothing items from various brands and styles using our powerful search.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="p-2 bg-primary/10 rounded-full">
                  <SaveIcon />
                </div>
                <h3 className="text-xl font-bold">Save</h3>
                <p className="text-muted-foreground text-center">
                  Save your favorite items to your personal collection for later.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6">
                <div className="p-2 bg-primary/10 rounded-full">
                  <TryOnIcon />
                </div>
                <h3 className="text-xl font-bold">Try On</h3>
                <p className="text-muted-foreground text-center">
                  Visualize your saved items on a 3D mannequin customized to your body shape.
                </p>
              </div>
            </div>
          </div>
        </section>
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
  )
}

