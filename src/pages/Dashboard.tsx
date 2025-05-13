import { useState } from 'react';
import { User, Lock, Mail, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Dashboard = () => {
  const { isLoggedIn, user, login, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: formData.name,
      email: formData.email,
    });
  };

  const handleLogout = () => {
    logout();
    setFormData({
      name: '',
      email: '',
      password: '',
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#0A3D62] p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Logg inn</h1>
            <p>Få tilgang til din personlige side og administrer billettene dine.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Navn
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0A3D62] focus:border-[#0A3D62]"
                  placeholder="Ditt navn"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-post
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0A3D62] focus:border-[#0A3D62]"
                  placeholder="din.epost@eksempel.no"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Passord
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0A3D62] focus:border-[#0A3D62]"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0A3D62] focus:ring-[#0A3D62] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Husk meg
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-[#0A3D62] hover:text-[#FF7F50]">
                  Glemt passord?
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#0A3D62] hover:bg-[#0D5C8C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A3D62]"
              >
                Logg inn
              </button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Har du ikke en konto?{' '}
                <a href="#" className="font-medium text-[#0A3D62] hover:text-[#FF7F50]">
                  Registrer deg
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-[#0A3D62] p-6 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Min Side</h1>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition-colors"
            >
              Logg ut
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Velkommen, {user?.name}!</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Din profil</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Navn</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">E-post</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Dine lagrede ønsker</h3>
            
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map(item => (
                  <div 
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex"
                  >
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover"
                      />
                    )}
                    <div className="p-3 flex-grow flex flex-col">
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{item.type}</p>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="mt-auto self-end text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 py-4 text-center bg-gray-50 rounded-lg">
                Du har ingen lagrede arrangementer eller attraksjoner ennå.
              </p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Dine tidligere billettkjøp</h3>
            <p className="text-gray-600 py-4 text-center bg-gray-50 rounded-lg">
              Du har ingen tidligere billettkjøp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;