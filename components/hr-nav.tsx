"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { useTranslations } from 'next-intl'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context";
import { LanguageToggle } from "./language-toggle"

export function HRNav() {
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('navigation')
  const { signOut } = useAuth()

  return (
    <nav className="flex items-center space-x-4 rtl:space-x-reverse">
      <LanguageToggle />
      <Link
        href={`/${locale}/hr/dashboard`}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === `/${locale}/hr/dashboard` ? "text-primary" : "text-muted-foreground",
        )}
      >
        {t('dashboard')}
      </Link>
      <Link
        href={`/${locale}/hr/jobs`}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === `/${locale}/hr/jobs` || pathname.startsWith(`/${locale}/hr/jobs/`) ? "text-primary" : "text-muted-foreground",
        )}
      >
        {t('jobs')}
      </Link>
      <Link
        href={`/${locale}/hr/jobs/create`}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === `/${locale}/hr/jobs/create` ? "text-primary" : "text-muted-foreground",
        )}
      >
        {t('postJob')}
      </Link>
      <Link
        href={`/${locale}/hr/recommendations`}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === `/${locale}/hr/recommendations` ? "text-primary" : "text-muted-foreground",
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
