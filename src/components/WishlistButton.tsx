import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { WishlistItem } from '../types';

interface WishlistButtonProps {
  item: WishlistItem;
}

const WishlistButton = ({ item }: WishlistButtonProps) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isSaved = isInWishlist(item.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={`
        p-2 rounded-full transition-all duration-300
        ${isSaved 
          ? 'bg-red-500 text-white' 
          : 'bg-white text-gray-500 hover:bg-red-100'
        }
      `}
      aria-label={isSaved ? 'Fjern fra ønskeliste' : 'Legg til i ønskeliste'}
    >
      <Heart
        className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}
      />
    </button>
  );
};

export default WishlistButton;