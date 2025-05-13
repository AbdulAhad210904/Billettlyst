import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket, ArrowLeft, Music, Users } from 'lucide-react';
import { fetchEventById } from '../services/api';
import { formatDate, formatDateTime } from '../utils/formatDate';
import { Event } from '../types';
import EventCard from '../components/EventCard';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const eventData = await fetchEventById(id);
        setEvent(eventData);
        
        // Update the page title
        document.title = eventData ? `${eventData.name} | Billettlyst` : 'Arrangement | Billettlyst';
      } catch (error) {
        console.error('Error loading event details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
    
    // Reset title when component unmounts
    return () => {
      const titleElement = document.querySelector('title');
      if (titleElement && titleElement.hasAttribute('data-default')) {
        document.title = 'Billettlyst | Din billett til opplevelser';
      }
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="h-10 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Arrangementet ble ikke funnet</h2>
        <p className="mb-6">Beklager, vi kunne ikke finne informasjon om dette arrangementet.</p>
        <Link to="/" className="inline-flex items-center text-[#0A3D62] hover:text-[#FF7F50]">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Tilbake til forsiden
        </Link>
      </div>
    );
  }

  // Find the hero image (prefer 16:9 ratio with high resolution)
  const heroImage = event.images?.find(img => img.ratio === '16_9' && img.width > 800) || 
                    event.images?.find(img => img.width > 800) || 
                    event.images?.[0];
                    
  const venue = event._embedded?.venues?.[0];
  const attractions = event._embedded?.attractions || [];
  const classifications = event.classifications || [];
  const genres = classifications
    .map(c => [c.segment?.name, c.genre?.name, c.subGenre?.name])
    .flat()
    .filter(Boolean)
    .filter((value, index, self) => self.indexOf(value) === index);
  
  const startDate = event.dates?.start?.localDate;
  const startTime = event.dates?.start?.localTime;
  const formattedDate = startDate ? formatDate(startDate) : 'Dato ikke tilgjengelig';
  const formattedDateTime = (startDate && startTime) 
    ? formatDateTime(startDate, startTime) 
    : formattedDate;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-[#0A3D62] hover:text-[#FF7F50] mb-6">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Tilbake til forsiden
      </Link>

      {/* Event Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        {heroImage && (
          <div className="relative h-64 md:h-96">
            <img 
              src={heroImage.url} 
              alt={event.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.name}</h1>
              {venue && (
                <div className="flex items-center text-white/90 mb-1">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{venue.name}, {venue.city.name}, {venue.country.name}</span>
                </div>
              )}
              <div className="flex items-center text-white/90">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formattedDate}</span>
                {startTime && (
                  <>
                    <Clock className="h-5 w-5 ml-4 mr-2" />
                    <span>{startTime.substring(0, 5)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Information */}
        <div className="lg:col-span-2">
          {/* Genres */}
          {genres.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <Music className="mr-2 h-5 w-5 text-[#FF7F50]" />
                Sjangere
              </h2>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-[#0A3D62] px-3 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {(event.info || event.pleaseNote) && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-3">Informasjon om arrangementet</h2>
              {event.info && <p className="text-gray-700 mb-4">{event.info}</p>}
              {event.pleaseNote && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Merk:</h3>
                  <p className="text-gray-700">{event.pleaseNote}</p>
                </div>
              )}
            </div>
          )}

          {/* Artists/Performers */}
          {attractions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#FF7F50]" />
                Artister
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attractions.map(attraction => (
                  <div 
                    key={attraction.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm flex"
                  >
                    {attraction.images && attraction.images.length > 0 && (
                      <img 
                        src={attraction.images[0].url} 
                        alt={attraction.name}
                        className="w-24 h-24 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900">{attraction.name}</h3>
                      {attraction.classifications?.[0]?.genre?.name && (
                        <p className="text-sm text-gray-600">
                          {attraction.classifications[0].genre.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Ticket Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Ticket className="mr-2 h-5 w-5 text-[#FF7F50]" />
              Billettinformasjon
            </h2>
            
            <div className="mb-4">
              <p className="text-gray-700 font-medium">Dato og tid:</p>
              <p className="text-gray-900">{formattedDateTime}</p>
            </div>
            
            {venue && (
              <div className="mb-4">
                <p className="text-gray-700 font-medium">Sted:</p>
                <p className="text-gray-900">{venue.name}</p>
                <p className="text-gray-600">{venue.address?.line1}</p>
                <p className="text-gray-600">{venue.city.name}, {venue.country.name}</p>
              </div>
            )}
            
            {event.priceRanges && event.priceRanges.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-700 font-medium">Priser:</p>
                {event.priceRanges.map((price, index) => (
                  <p key={index} className="text-gray-900">
                    {price.min === price.max 
                      ? `${price.min} ${price.currency}`
                      : `${price.min} - ${price.max} ${price.currency}`}
                    {price.type && ` (${price.type})`}
                  </p>
                ))}
              </div>
            )}
            
            <a 
              href={event.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#FF7F50] hover:bg-[#FF6B4A] text-white font-medium py-3 px-4 rounded text-center block transition-colors"
            >
              Kjøp billetter
            </a>
          </div>
          
          {/* Venue Information */}
          {venue && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Sted</h2>
              <h3 className="font-medium text-gray-900 mb-2">{venue.name}</h3>
              
              {venue.images && venue.images.length > 0 && (
                <img
                  src={venue.images[0].url}
                  alt={venue.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}
              
              <div className="text-gray-700">
                {venue.address?.line1 && <p>{venue.address.line1}</p>}
                <p>{venue.city.name}, {venue.postalCode}</p>
                <p>{venue.country.name}</p>
              </div>
              
              {venue.url && (
                <a 
                  href={venue.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 text-[#0A3D62] hover:text-[#FF7F50] inline-block transition-colors"
                >
                  Mer informasjon om stedet
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;