import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { fetchEventsByCity, searchEvents } from '../services/api';
import EventCard from '../components/EventCard';
import CityButton from '../components/CityButton';
import { Event } from '../types';

const cities = ['Oslo', 'Bergen', 'London', 'Berlin', 'Paris', 'Stockholm'];

const Home = () => {
  const [selectedCity, setSelectedCity] = useState('Oslo');
  const [cityEvents, setCityEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        // Load events from selected city
        const cityData = await fetchEventsByCity(selectedCity, 10);
        setCityEvents(cityData);
        
        // Load featured events (music festivals)
        if (featuredEvents.length === 0) {
          const featured = await searchEvents('festival');
          setFeaturedEvents(featured.slice(0, 4));
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [selectedCity]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchEvents(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching events:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
<section className="bg-gradient-to-r from-[#0A3D62] to-[#1a5b8c] rounded-xl shadow-lg overflow-hidden mb-12">
  <div className="container mx-auto px-6 py-12 lg:py-16 flex flex-col lg:flex-row items-center max-h-[600px] lg:max-h-[500px]">
    {/* Text Section */}
    <div className="lg:w-1/2 text-white space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
        Finn din neste opplevelse med Billettlyst
      </h1>
      <p className="text-lg text-blue-100">
        Konserter, sport, teater og mer - alt på ett sted. Vi har billetter til de beste arrangementene i Norge og Europa.
      </p>

      <form onSubmit={handleSearch} className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Søk etter arrangementer..."
          className="w-full py-3 px-4 pl-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF7F50]"
        />
        <Search className="absolute left-4 top-3.5 text-gray-500 h-5 w-5" />
        <button
          type="submit"
          className="absolute right-2 top-2 bg-[#FF7F50] hover:bg-[#FF6B4A] text-white rounded-full px-4 py-1.5 transition-colors"
        >
          Søk
        </button>
      </form>
    </div>

    {/* Image Section */}
    <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-end max-h-[400px]">
      <img 
        src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg" 
        alt="Konsert"
        className="rounded-lg shadow-lg max-h-[400px] w-auto h-full object-cover"
      />
    </div>
  </div>
</section>


      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Søkeresultater for "{searchQuery}"
            </h2>
            <button 
              onClick={() => setSearchResults([])}
              className="text-[#0A3D62] hover:text-[#FF7F50] transition-colors"
            >
              Lukk
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Events */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Utvalgte Arrangementer
          </h2>
          <Link to="/category/music" className="flex items-center text-[#0A3D62] hover:text-[#FF7F50] transition-colors">
            <span className="mr-1">Se alle</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-6 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </section>

      {/* City Events */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            I {selectedCity} kan du oppleve:
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {cities.map(city => (
              <CityButton 
                key={city}
                city={city}
                isActive={selectedCity === city}
                onClick={handleCityChange}
              />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-6 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))
          ) : cityEvents.length > 0 ? (
            cityEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                isClickable={false}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600">
                Ingen arrangementer funnet i {selectedCity} for øyeblikket.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;