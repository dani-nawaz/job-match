import Link from "next/link"
import { getTranslations } from 'next-intl/server'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageToggle } from "@/components/language-toggle"

interface HomeProps {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  
  const t = await getTranslations('homepage')
  const tCommon = await getTranslations('common')

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2">
              <span className="font-bold">InternMatch</span>
            </Link>
          </div>          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <LanguageToggle />
              <Button asChild variant="outline">
                <Link href={`/${locale}/login`}>{tCommon('signIn')}</Link>
              </Button>
              <Button asChild>
                <Link href={`/${locale}/signup`}>{tCommon('signUp')}</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    {t('hero.title')}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t('hero.description')}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href={`/${locale}/signup`}>{t('hero.getStarted')}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={`/${locale}/login`}>{tCommon('signIn')}</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/university-company-connection.png"
                  width={550}
                  height={550}
                  alt={t('hero.imageAlt')}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  {t('howItWorks.title')}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t('howItWorks.description')}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('features.universities.title')}</CardTitle>
                  <CardDescription>{t('features.universities.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>{t('features.universities.feature1')}</li>
                    <li>{t('features.universities.feature2')}</li>
                    <li>{t('features.universities.feature3')}</li>
                    <li>{t('features.universities.feature4')}</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/${locale}/signup`}>{t('features.universities.cta')}</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('features.companies.title')}</CardTitle>
                  <CardDescription>{t('features.companies.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>{t('features.companies.feature1')}</li>
                    <li>{t('features.companies.feature2')}</li>
                    <li>{t('features.companies.feature3')}</li>
                    <li>{t('features.companies.feature4')}</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/${locale}/signup`}>{t('features.companies.cta')}</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('features.ai.title')}</CardTitle>
                  <CardDescription>{t('features.ai.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>{t('features.ai.feature1')}</li>
                    <li>{t('features.ai.feature2')}</li>
                    <li>{t('features.ai.feature3')}</li>
                    <li>{t('features.ai.feature4')}</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/${locale}/about`}>{tCommon('learnMore')}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  )
}
