"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { logoutUser } from "@/lib/firebase-service"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="font-bold">Fashion App</Link>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
