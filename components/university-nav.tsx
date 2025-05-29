"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { useTranslations } from 'next-intl'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function UniversityNav() {
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('navigation')
  const { signOut } = useAuth()

  return (
    <nav className="flex items-center space-x-4 rtl:space-x-reverse">
      <Link
        href={`/${locale}/university/dashboard`}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === `/${locale}/university/dashboard` ? "text-primary" : "text-muted-foreground",
        )}
      >
        {t('dashboard')}
      </Link>
      <Link
        href={`/${locale}/university/students`}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === `/${locale}/university/students` || pathname.startsWith(`/${locale}/university/students/`)
            ? "text-primary"
            : "text-muted-foreground",
        )}
      >
        {t('students')}
      </Link>
      <Link
        href={`/${locale}/university/students/upload`}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === `/${locale}/university/students/upload` ? "text-primary" : "text-muted-foreground",
        )}
      >
        {t('upload')}
      </Link>
      <Link
        href={`/${locale}/university/recommendations`}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === `/${locale}/university/recommendations` ? "text-primary" : "text-muted-foreground",
        )}
      >
        {t('recommendations')}
      </Link>
      <Button variant="ghost" size="sm" onClick={() => signOut()}>
        {t('logout')}
      </Button>
    </nav>
  )
}
