import UniversityDashboardClient from './university-dashboard-client'


interface UniversityDashboardProps {
  params: Promise<{
    locale: string
  }>
}

export default async function UniversityDashboard({ params }: UniversityDashboardProps) {  const { locale } = await params
  
  return <UniversityDashboardClient locale={locale} />
}
  