import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { fetchCategoryContent, fetchSuggest } from '../services/api';
import { Event, Attraction, Venue } from '../types';
import EventCard from '../components/EventCard';
import WishlistButton from '../components/WishlistButton';

const categoryTranslations: Record<string, string> = {
  'music': 'Musikk',
  'sports': 'Sport',
  'arts': 'Teater/Show',
  'family': 'Familie',
};

const Category = () => {
  const { type } = useParams<{ type: string }>();
  const categoryName = categoryTranslations[type || 'music'] || 'Kategori';
  
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    date: string;
    country: string;
    city: string;
  }>({
    date: '',
    country: '',
    city: '',
  });
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategoryContent = async () => {
      if (!type) return;
      
      setIsLoading(true);
      try {
        const content = await fetchCategoryContent(type, filters);
        setAttractions(content.attractions);
        setEvents(content.events);
        setVenues(content.venues);
        
        document.title = `${categoryName} | Billettlyst`;
      } catch (error) {
        console.error('Error loading category content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryContent();
    
    return () => {
      const titleElement = document.querySelector('title');
      if (titleElement && titleElement.hasAttribute('data-default')) {
        document.title = 'Billettlyst | Din billett til opplevelser';
      }
    };
  }, [type, filters]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await fetchSuggest(searchQuery);
      setAttractions(results.attractions);
      setEvents(results.events);
      setVenues(results.venues);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      country: '',
      city: '',
    });
  };

  const renderAttraction = (attraction: Attraction) => {
    const image = attraction.images?.find(img => img.ratio === '16_9') || 
                  attraction.images?.[0] || 
                  { url: 'https://via.placeholder.com/400x225?text=Ingen+Bilde' };
    
    const genre = attraction.classifications?.[0]?.genre?.name || 'Ukjent sjanger';

    return (
      <div key={attraction.id} className="bg-white rounded-lg overflow-hidden shadow-md relative">
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton 
            item={{
              id: attraction.id,
              type: 'attraction',
              name: attraction.name,
              image: image.url
            }}
          />
        </div>
        <div className="h-48 overflow-hidden">
          <img 
            src={image.url} 
            alt={attraction.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{attraction.name}</h3>
          <p className="text-sm text-gray-600">{genre}</p>
        </div>
      </div>
    );
  };

  const renderVenue = (venue: Venue) => {
    if (!venue || !venue.city || !venue.country) {
      return null;
    }

    const image = venue.images?.find(img => img.ratio === '16_9') || 
                  venue.images?.[0] || 
                  { url: 'https://via.placeholder.com/400x225?text=Ingen+Bilde' };

    return (
      <div key={venue.id} className="bg-white rounded-lg overflow-hidden shadow-md relative">
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton 
            item={{
              id: venue.id,
              type: 'venue',
              name: venue.name,
              image: image.url
            }}
          />
        </div>
        <div className="h-48 overflow-hidden">
          <img 
            src={image.url} 
            alt={venue.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{venue.name}</h3>
          <p className="text-sm text-gray-600">
            {venue.city.name}, {venue.country.name}
          </p>
        </div>
      </div>
    );
  };

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
            <button
              type="submit"
              className="absolute right-2 top-2 text-[#0A3D62]"
              aria-label="Søk"
            >
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
        
        {isFiltersOpen && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Filtrer resultater</h2>
              <button 
                onClick={() => setIsFiltersOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dato fra
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Land
                </label>
                <input
                  type="text"
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  placeholder="f.eks. Norge, UK, US"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  By
                </label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  placeholder="f.eks. Oslo, London"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
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
                onClick={() => setIsFiltersOpen(false)}
                className="px-4 py-2 bg-[#0A3D62] text-white rounded hover:bg-[#0D5C8C]"
              >
                Bruk filter
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Arrangementer</h2>
            
            {events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    isClickable={false}
                    showWishlist
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 py-8 text-center">
                Ingen arrangementer funnet i denne kategorien.
              </p>
            )}
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Attraksjoner</h2>
            
            {attractions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {attractions.map(attraction => renderAttraction(attraction))}
              </div>
            ) : (
              <p className="text-gray-600 py-8 text-center">
                Ingen attraksjoner funnet i denne kategorien.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Spillesteder</h2>
            
            {venues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {venues.map(venue => renderVenue(venue)).filter(Boolean)}
              </div>
            ) : (
              <p className="text-gray-600 py-8 text-center">
                Ingen spillesteder funnet i denne kategorien.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Category;