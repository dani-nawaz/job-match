"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, MapPin, Building, Briefcase, Star, ChevronRight } from "lucide-react"

// Mock internship data
const mockInternships = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "TechCorp",
    location: "San Francisco, CA",
    description: "Join our engineering team to build cutting-edge web applications using React and Node.js.",
    match: 92,
    tags: ["Skills match", "Goals match", "Merit match"],
    duration: "3 months",
    type: "Full-time",
    stipend: "$2000/month",
  },
  {
    id: 2,
    title: "Data Science Intern", 
    company: "DataWorks",
    location: "Remote",
    description: "Work with our data science team to analyze large datasets and build predictive models.",
    match: 87,
    tags: ["Skills match", "Merit match"],
    duration: "4 months",
    type: "Full-time",
    stipend: "$1800/month",
  },
  {
    id: 3,
    title: "UX Design Intern",
    company: "DesignHub", 
    location: "New York, NY",
    description: "Create user-centered designs for web and mobile applications.",
    match: 78,
    tags: ["Goals match", "Skills match"],
    duration: "3 months",
    type: "Part-time",
    stipend: "$1500/month",
  },
  {
    id: 4,
    title: "Frontend Developer Intern",
    company: "WebSolutions",
    location: "Boston, MA", 
    description: "Build responsive and accessible user interfaces using modern frontend technologies.",
    match: 83,
    tags: ["Skills match"],
    duration: "6 months",
    type: "Full-time",
    stipend: "$2200/month",
  },
  {
    id: 5,
    title: "Marketing Intern",
    company: "BrandCorp",
    location: "Chicago, IL",
    description: "Support our marketing team with campaign development and social media management.",
    match: 71,
    tags: ["Goals match"],
    duration: "2 months",
    type: "Part-time",
    stipend: "$1200/month",
  }
]

export default function RecommendationsPage() {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('recommendations')
  const tCommon = useTranslations('common')

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("match")
  const [filterLocation, setFilterLocation] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [minMatch, setMinMatch] = useState([70])
  const [showFilters, setShowFilters] = useState(false)

  const filteredInternships = mockInternships
    .filter(internship => {
      const matchesSearch = internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           internship.company.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesLocation = filterLocation === "all" || internship.location.includes(filterLocation)
      const matchesType = filterType === "all" || internship.type.toLowerCase() === filterType.toLowerCase()
      const matchesMinScore = internship.match >= minMatch[0]
      
      return matchesSearch && matchesLocation && matchesType && matchesMinScore
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "match":
          return b.match - a.match
        case "company":
          return a.company.localeCompare(b.company)
        case "location":
          return a.location.localeCompare(b.location)
        default:
          return b.match - a.match
      }
    })

  const getMatchColor = (match: number) => {
    if (match >= 90) return "text-green-600 bg-green-50"
    if (match >= 80) return "text-blue-600 bg-blue-50"
    if (match >= 70) return "text-yellow-600 bg-yellow-50"
    return "text-gray-600 bg-gray-50"
  }

  const getMatchLabel = (match: number) => {
    if (match >= 90) return t('matchLevels.excellent')
    if (match >= 80) return t('matchLevels.good')
    if (match >= 70) return t('matchLevels.fair')
    return t('matchLevels.poor')
  }

  return (
    <div 
      className="min-h-screen bg-gray-50"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${locale === 'ar' ? 'font-arabic' : ''}`}>
            {t('title')}
          </h1>
          <p className={`text-gray-600 ${locale === 'ar' ? 'font-arabic' : ''}`}>
            {t('subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className={`absolute top-3 h-4 w-4 text-gray-400 ${locale === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${locale === 'ar' ? 'pr-10 text-right font-arabic' : 'pl-10'}`}
                />
              </div>

              {/* Sort */}
              <div className="min-w-[200px]">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">{t('sortBy.match')}</SelectItem>
                    <SelectItem value="company">{t('sortBy.company')}</SelectItem>
                    <SelectItem value="location">{t('sortBy.location')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`min-w-[120px] ${locale === 'ar' ? 'font-arabic' : ''}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                {t('filters')}
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Location Filter */}
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${locale === 'ar' ? 'font-arabic' : ''}`}>
                      {t('filterBy.location')}
                    </label>
                    <Select value={filterLocation} onValueChange={setFilterLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('filterOptions.allLocations')}</SelectItem>
                        <SelectItem value="Remote">{t('filterOptions.remote')}</SelectItem>
                        <SelectItem value="San Francisco">{t('filterOptions.sanFrancisco')}</SelectItem>
                        <SelectItem value="New York">{t('filterOptions.newYork')}</SelectItem>
                        <SelectItem value="Boston">{t('filterOptions.boston')}</SelectItem>
                        <SelectItem value="Chicago">{t('filterOptions.chicago')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${locale === 'ar' ? 'font-arabic' : ''}`}>
                      {t('filterBy.type')}
                    </label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('filterOptions.allTypes')}</SelectItem>
                        <SelectItem value="full-time">{t('filterOptions.fullTime')}</SelectItem>
                        <SelectItem value="part-time">{t('filterOptions.partTime')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Match Score Filter */}
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${locale === 'ar' ? 'font-arabic' : ''}`}>
                      {t('filterBy.minMatch')}: {minMatch[0]}%
                    </label>
                    <Slider
                      value={minMatch}
                      onValueChange={setMinMatch}
                      max={100}
                      min={0}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className={`mb-6 ${locale === 'ar' ? 'font-arabic' : ''}`}>
          <p className="text-gray-600">
            {t('resultsFound', { count: filteredInternships.length })}
          </p>
        </div>

        {/* Internship Cards */}
        <div className="space-y-6">
          {filteredInternships.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className={`text-gray-500 text-lg ${locale === 'ar' ? 'font-arabic' : ''}`}>
                  {t('noResults')}
                </p>
                <p className={`text-gray-400 mt-2 ${locale === 'ar' ? 'font-arabic' : ''}`}>
                  {t('noResultsSubtitle')}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredInternships.map((internship) => (
              <Card key={internship.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className={`text-xl font-semibold text-gray-900 mb-1 ${locale === 'ar' ? 'font-arabic' : ''}`}>
                            {internship.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <Building className="h-4 w-4 mr-1" />
                            <span className={locale === 'ar' ? 'font-arabic' : ''}>{internship.company}</span>
                            <MapPin className="h-4 w-4 ml-4 mr-1" />
                            <span className={locale === 'ar' ? 'font-arabic' : ''}>{internship.location}</span>
                          </div>
                        </div>
                        <div className={`text-right ${locale === 'ar' ? 'text-left' : ''}`}>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(internship.match)}`}>
                            <Star className="h-3 w-3 mr-1" />
                            {internship.match}% {t('match')}
                          </div>
                          <p className={`text-xs text-gray-500 mt-1 ${locale === 'ar' ? 'font-arabic' : ''}`}>
                            {getMatchLabel(internship.match)}
                          </p>
                        </div>
                      </div>

                      <p className={`text-gray-600 mb-4 ${locale === 'ar' ? 'font-arabic' : ''}`}>
                        {internship.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {internship.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className={locale === 'ar' ? 'font-arabic' : ''}>
                            {t(`tags.${tag.toLowerCase().replace(' ', '')}`)}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className={`text-gray-500 ${locale === 'ar' ? 'font-arabic' : ''}`}>{t('duration')}:</span>
                          <p className={`font-medium ${locale === 'ar' ? 'font-arabic' : ''}`}>{internship.duration}</p>
                        </div>
                        <div>
                          <span className={`text-gray-500 ${locale === 'ar' ? 'font-arabic' : ''}`}>{t('type')}:</span>
                          <p className={`font-medium ${locale === 'ar' ? 'font-arabic' : ''}`}>{internship.type}</p>
                        </div>
                        <div>
                          <span className={`text-gray-500 ${locale === 'ar' ? 'font-arabic' : ''}`}>{t('stipend')}:</span>
                          <p className={`font-medium ${locale === 'ar' ? 'font-arabic' : ''}`}>{internship.stipend}</p>
                        </div>
                        <div className="flex justify-end">
                          <Link href={`/${locale}/internships/${internship.id}`}>
                            <Button variant="outline" size="sm" className={locale === 'ar' ? 'font-arabic' : ''}>
                              {t('viewDetails')}
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
