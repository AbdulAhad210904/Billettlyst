import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import { Event } from '../types';
import WishlistButton from './WishlistButton';

interface EventCardProps {
  event: Event;
  isClickable?: boolean;
  showWishlist?: boolean;
}

const EventCard = ({ event, isClickable = true, showWishlist = false }: EventCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Find the best image (prefer 16:9 ratio or the first available)
  const image = event.images?.find(img => img.ratio === '16_9' && img.width > 500) || 
                event.images?.[0] || 
                { url: 'https://via.placeholder.com/400x225?text=Ingen+Bilde' };

  const venue = event._embedded?.venues?.[0];
  const location = venue?.city?.name && venue?.country?.name
    ? `${venue.city.name}, ${venue.country.name}`
    : 'Ukjent sted';
  const formattedDate = event.dates?.start?.localDate ? formatDate(event.dates.start.localDate) : 'Dato ikke tilgjengelig';

  const cardContent = (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gray-200 transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}></div>
        <img 
          src={image.url} 
          alt={event.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onLoad={() => setIsLoaded(true)}
        />
        {showWishlist && (
          <div className="absolute top-2 right-2">
            <WishlistButton 
              item={{
                id: event.id,
                type: 'event',
                name: event.name,
                image: image.url
              }}
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{event.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">{formattedDate}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link to={`/event/${event.id}`} className="block group">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default EventCard;