import { Link } from 'react-router-dom';
import { TicketIcon, UserIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoggedIn } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <nav className="bg-[#0A3D62] text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <TicketIcon className="h-8 w-8 text-[#FF7F50]" />
            <span className="text-2xl font-bold">Billettlyst</span>
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-[#FF7F50] transition-colors">
              Hjem
            </Link>
            <Link to="/category/music" className="hover:text-[#FF7F50] transition-colors">
              Musikk
            </Link>
            <Link to="/category/sports" className="hover:text-[#FF7F50] transition-colors">
              Sport
            </Link>
            <Link to="/category/arts" className="hover:text-[#FF7F50] transition-colors">
              Teater/Show
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-[#0D5C8C] transition-colors"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            <Link 
              to="/dashboard" 
              className="p-2 rounded-full hover:bg-[#0D5C8C] transition-colors"
              aria-label={isLoggedIn ? "Min Side" : "Logg Inn"}
            >
              <UserIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {isSearchOpen && (
          <div className="mt-3 pb-3">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Søk etter arrangementer..."
                className="flex-grow p-2 text-black rounded-l focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-[#FF7F50] hover:bg-[#FF6B4A] p-2 rounded-r transition-colors"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;