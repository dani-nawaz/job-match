"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function UniversityNav() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <nav className="flex items-center space-x-4">
      <Link
        href="/university/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/university/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/university/students"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/university/students" || pathname.startsWith("/university/students/")
            ? "text-primary"
            : "text-muted-foreground",
        )}
      >
        Students
      </Link>
      <Link
        href="/university/students/upload"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/university/students/upload" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Upload
      </Link>
      <Link
        href="/university/recommendations"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/university/recommendations" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Recommendations
      </Link>
      <Button variant="ghost" size="sm" onClick={() => signOut()}>
        Logout
      </Button>
    </nav>
  )
}
