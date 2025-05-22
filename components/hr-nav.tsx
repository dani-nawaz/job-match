"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function HRNav() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <nav className="flex items-center space-x-4">
      <Link
        href="/hr/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/hr/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/hr/jobs"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/hr/jobs" || pathname.startsWith("/hr/jobs/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Jobs
      </Link>
      <Link
        href="/hr/jobs/create"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/hr/jobs/create" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Post Job
      </Link>
      <Link
        href="/hr/recommendations"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/hr/recommendations" ? "text-primary" : "text-muted-foreground",
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
