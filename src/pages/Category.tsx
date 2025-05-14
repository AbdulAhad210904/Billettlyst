"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { Search, Filter, X, ArrowRight, Calendar, MapPin, Globe } from "lucide-react"
import { fetchCategoryContent, fetchSuggest } from "../services/api"
import type { Event, Attraction, Venue } from "../types"
import EventCard from "../components/EventCard"
import WishlistButton from "../components/WishlistButton"

const categoryTranslations: Record<string, string> = {
  music: "Musikk",
  sports: "Sport",
  arts: "Teater/Show",
  family: "Familie",
}

const Category = () => {
  const { type } = useParams<{ type: string }>()
  const categoryName = categoryTranslations[type || "music"] || "Kategori"

  // Original data from API
  const [allAttractions, setAllAttractions] = useState<Attraction[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [allVenues, setAllVenues] = useState<Venue[]>([])

  // Filtered data to display
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [venues, setVenues] = useState<Venue[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<{
    date: string
    country: string
    city: string
  }>({
    date: "",
    country: "",
    city: "",
  })

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [countrySuggestions, setCountrySuggestions] = useState<Array<{ code: string; name: string }>>([])
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false)
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)

  // Extract unique countries and cities from data
  const { uniqueCountries, uniqueCities } = useMemo(() => {
    const countries = new Map<string, { code: string; name: string }>()
    const cities = new Map<string, Set<string>>()

    // Process events
    allEvents.forEach((event) => {
      const venue = event._embedded?.venues?.[0]
      if (venue?.country?.countryCode && venue?.country?.name) {
        countries.set(venue.country.countryCode, {
          code: venue.country.countryCode,
          name: venue.country.name,
        })

        if (venue.city?.name) {
          if (!cities.has(venue.country.countryCode)) {
            cities.set(venue.country.countryCode, new Set())
          }
          cities.get(venue.country.countryCode)?.add(venue.city.name)
        }
      }
    })

    // Process venues
    allVenues.forEach((venue) => {
      if (venue?.country?.countryCode && venue?.country?.name) {
        countries.set(venue.country.countryCode, {
          code: venue.country.countryCode,
          name: venue.country.name,
        })

        if (venue.city?.name) {
          if (!cities.has(venue.country.countryCode)) {
            cities.set(venue.country.countryCode, new Set())
          }
          cities.get(venue.country.countryCode)?.add(venue.city.name)
        }
      }
    })

    // Convert to arrays
    const uniqueCountries = Array.from(countries.values())

    // Convert cities map to object with arrays
    const uniqueCities: Record<string, string[]> = {}
    cities.forEach((citySet, countryCode) => {
      uniqueCities[countryCode] = Array.from(citySet).sort()
    })

    return { uniqueCountries, uniqueCities }
  }, [allEvents, allVenues])

  // Initial data loading
  useEffect(() => {
    const loadCategoryContent = async () => {
      if (!type) return

      setIsLoading(true)
      try {
        const content = await fetchCategoryContent(type)

        // Store the original data
        setAllAttractions(content.attractions)
        setAllEvents(content.events)
        setAllVenues(content.venues)

        // Initialize the filtered data with all data
        setAttractions(content.attractions)
        setEvents(content.events)
        setVenues(content.venues)

        document.title = `${categoryName} | Billettlyst`
      } catch (error) {
        console.error("Error loading category content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategoryContent()

    return () => {
      const titleElement = document.querySelector("title")
      if (titleElement && titleElement.hasAttribute("data-default")) {
        document.title = "Billettlyst | Din billett til opplevelser"
      }
    }
  }, [type])

  // Update country suggestions when typing in country field
  useEffect(() => {
    if (!filters.country.trim()) {
      setCountrySuggestions([])
      return
    }

    const query = filters.country.toLowerCase()
    const matches = uniqueCountries.filter(
      (country) => country.name.toLowerCase().includes(query) || country.code.toLowerCase().includes(query),
    )
    setCountrySuggestions(matches)
  }, [filters.country, uniqueCountries])

  // Update city suggestions when typing in city field
  useEffect(() => {
    if (!filters.city.trim() || !filters.country) {
      setCitySuggestions([])
      return
    }

    // Find the country code from the input
    const countryCode = uniqueCountries.find(
      (c) =>
        c.name.toLowerCase() === filters.country.toLowerCase() ||
        c.code.toLowerCase() === filters.country.toLowerCase(),
    )?.code

    if (!countryCode || !uniqueCities[countryCode]) {
      setCitySuggestions([])
      return
    }

    const query = filters.city.toLowerCase()
    const matches = uniqueCities[countryCode].filter((city) => city.toLowerCase().includes(query))
    setCitySuggestions(matches)
  }, [filters.city, filters.country, uniqueCountries, uniqueCities])

  // Apply filters to the data
  useEffect(() => {
    if (isSearchMode) return // Skip filtering if in search mode

    // Update active filters for display
    const active: string[] = []
    if (filters.date) {
      const formattedDate = new Date(filters.date).toLocaleDateString("no-NO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      active.push(`Dato: ${formattedDate}`)
    }
    if (filters.country) {
      active.push(`Land: ${filters.country}`)
    }
    if (filters.city) {
      active.push(`By: ${filters.city}`)
    }
    setActiveFilters(active)

    // Apply filters to events
    const filteredEvents = allEvents.filter((event) => {
      // Date filter
      if (filters.date) {
        const eventDate = event.dates?.start?.localDate
        if (!eventDate || new Date(eventDate) < new Date(filters.date)) {
          return false
        }
      }

      // Country filter
      if (filters.country) {
        const eventCountry = event._embedded?.venues?.[0]?.country
        if (!eventCountry) return false

        const countryMatches =
          eventCountry.countryCode.toLowerCase() === filters.country.toLowerCase() ||
          eventCountry.name.toLowerCase() === filters.country.toLowerCase()

        if (!countryMatches) return false
      }

      // City filter
      if (filters.city) {
        const eventCity = event._embedded?.venues?.[0]?.city?.name
        if (!eventCity || !eventCity.toLowerCase().includes(filters.city.toLowerCase())) {
          return false
        }
      }

      return true
    })

    // Apply filters to attractions
    const filteredAttractions = allAttractions.filter((attraction) => {
      // For attractions, we can only filter by country and city if they have upcoming events
      // with venues in those locations. This is a simplified approach.
      if (filters.country || filters.city) {
        // Check if any of the filtered events feature this attraction
        return filteredEvents.some((event) => event._embedded?.attractions?.some((a) => a.id === attraction.id))
      }
      return true
    })

    // Apply filters to venues
    const filteredVenues = allVenues.filter((venue) => {
      // Country filter
      if (filters.country) {
        const venueCountry = venue.country
        if (!venueCountry) return false

        const countryMatches =
          venueCountry.countryCode.toLowerCase() === filters.country.toLowerCase() ||
          venueCountry.name.toLowerCase() === filters.country.toLowerCase()

        if (!countryMatches) return false
      }

      // City filter
      if (filters.city) {
        const venueCity = venue.city?.name
        if (!venueCity || !venueCity.toLowerCase().includes(filters.city.toLowerCase())) {
          return false
        }
      }

      return true
    })

    setEvents(filteredEvents)
    setAttractions(filteredAttractions)
    setVenues(filteredVenues)
  }, [filters, allEvents, allAttractions, allVenues, isSearchMode])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      // If search is cleared, go back to filtered view of all data
      setIsSearchMode(false)
      return
    }

    setIsLoading(true)
    setIsSearchMode(true)

    try {
      const results = await fetchSuggest(searchQuery)
      setAttractions(results.attractions)
      setEvents(results.events)
      setVenues(results.venues)
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (name: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const selectCountry = (country: { code: string; name: string }) => {
    setFilters((prev) => ({
      ...prev,
      country: country.name,
    }))
    setShowCountrySuggestions(false)
  }

  const selectCity = (city: string) => {
    setFilters((prev) => ({
      ...prev,
      city: city,
    }))
    setShowCitySuggestions(false)
  }

  const applyFilters = () => {
    setIsFiltersOpen(false)
    setIsSearchMode(false) // Exit search mode when applying filters
  }

  const clearFilters = () => {
    setFilters({
      date: "",
      country: "",
      city: "",
    })

    if (isSearchMode) {
      // If in search mode, stay there
      return
    }

    // Reset to all data
    setEvents(allEvents)
    setAttractions(allAttractions)
    setVenues(allVenues)
  }

  const removeFilter = (filterIndex: number) => {
    const filterKey = Object.keys(filters).find((_, index) => {
      if (filters.date && index === 0) return filterIndex === 0
      if (filters.country && filters.date && index === 1) return filterIndex === 1
      if (filters.country && !filters.date && index === 1) return filterIndex === 0
      if (filters.city) return filterIndex === activeFilters.length - 1
      return false
    }) as keyof typeof filters | undefined

    if (filterKey) {
      setFilters((prev) => ({
        ...prev,
        [filterKey]: "",
      }))
    }
  }

  const renderAttraction = (attraction: Attraction) => {
    const image = attraction.images?.find((img) => img.ratio === "16_9") ||
      attraction.images?.[0] || { url: "https://via.placeholder.com/400x225?text=Ingen+Bilde" }

    const genre = attraction.classifications?.[0]?.genre?.name || "Ukjent sjanger"

    return (
      <div key={attraction.id} className="bg-white rounded-lg overflow-hidden shadow-md relative">
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton
            item={{
              id: attraction.id,
              type: "attraction",
              name: attraction.name,
              image: image.url,
            }}
          />
        </div>
        <div className="h-48 overflow-hidden">
          <img src={image.url || "/placeholder.svg"} alt={attraction.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{attraction.name}</h3>
          <p className="text-sm text-gray-600">{genre}</p>
        </div>
      </div>
    )
  }

  const renderVenue = (venue: Venue) => {
    if (!venue || !venue.city || !venue.country) {
      return null
    }

    const image = venue.images?.find((img) => img.ratio === "16_9") ||
      venue.images?.[0] || { url: "https://via.placeholder.com/400x225?text=Ingen+Bilde" }

    return (
      <div key={venue.id} className="bg-white rounded-lg overflow-hidden shadow-md relative">
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton
            item={{
              id: venue.id,
              type: "venue",
              name: venue.name,
              image: image.url,
            }}
          />
        </div>
        <div className="h-48 overflow-hidden">
          <img src={image.url || "/placeholder.svg"} alt={venue.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{venue.name}</h3>
          <p className="text-sm text-gray-600">
            {venue.city.name}, {venue.country.name}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{categoryName}</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-grow md:max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søk i denne kategorien..."
              className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <button type="submit" className="absolute right-2 top-2 text-[#0A3D62]" aria-label="Søk">
              <Search className="h-5 w-5" />
            </button>
          </form>

          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2" />
            <span>Filter</span>
          </button>
        </div>

        {/* Active filters display */}
        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-[#0A3D62] text-sm"
              >
                <span>{filter}</span>
                <button onClick={() => removeFilter(index)} className="ml-2 text-[#0A3D62] hover:text-[#FF7F50]">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
              >
                <span>Fjern alle filtre</span>
                <X className="ml-1 h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {isFiltersOpen && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Filtrert søk</h2>
              <button onClick={() => setIsFiltersOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  Dato:
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Globe className="h-4 w-4 mr-1 text-gray-500" />
                  Land:
                </label>
                <input
                  type="text"
                  value={filters.country}
                  onChange={(e) => handleFilterChange("country", e.target.value)}
                  onFocus={() => setShowCountrySuggestions(true)}
                  placeholder="Skriv inn land..."
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {showCountrySuggestions && countrySuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {countrySuggestions.map((country) => (
                      <div
                        key={country.code}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectCountry(country)}
                      >
                        {country.name} ({country.code})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  By:
                </label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  onFocus={() => setShowCitySuggestions(true)}
                  placeholder={filters.country ? "Skriv inn by..." : "Velg land først"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={!filters.country}
                />
                {showCitySuggestions && citySuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {citySuggestions.map((city) => (
                      <div
                        key={city}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectCity(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Tilbakestill
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-[#0A3D62] text-white rounded hover:bg-[#0D5C8C] flex items-center"
              >
                Filter
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Søk</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Søk etter event, attraksjon eller spillested</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md"
              />
              <button type="submit" className="px-4 py-2 bg-[#0A3D62] text-white rounded hover:bg-[#0D5C8C]">
                Søk
              </button>
            </div>
          </form>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-6 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
        </div>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Arrangementer{" "}
              {events.length > 0 && <span className="text-sm font-normal text-gray-500">({events.length})</span>}
            </h2>

            {events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} isClickable={false} showWishlist />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 py-8 text-center">
                {isSearchMode
                  ? "Ingen arrangementer funnet for dette søket."
                  : "Ingen arrangementer funnet med disse filterene."}
              </p>
            )}
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Attraksjoner{" "}
              {attractions.length > 0 && (
                <span className="text-sm font-normal text-gray-500">({attractions.length})</span>
              )}
            </h2>

            {attractions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {attractions.map((attraction) => renderAttraction(attraction))}
              </div>
            ) : (
              <p className="text-gray-600 py-8 text-center">
                {isSearchMode
                  ? "Ingen attraksjoner funnet for dette søket."
                  : "Ingen attraksjoner funnet med disse filterene."}
              </p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Spillesteder{" "}
              {venues.length > 0 && <span className="text-sm font-normal text-gray-500">({venues.length})</span>}
            </h2>

            {venues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {venues.map((venue) => renderVenue(venue)).filter(Boolean)}
              </div>
            ) : (
              <p className="text-gray-600 py-8 text-center">
                {isSearchMode
                  ? "Ingen spillesteder funnet for dette søket."
                  : "Ingen spillesteder funnet med disse filterene."}
              </p>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Category
