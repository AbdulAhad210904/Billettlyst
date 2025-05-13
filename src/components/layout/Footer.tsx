import { Link } from 'react-router-dom';
import { TicketIcon, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A3D62] text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <TicketIcon className="h-6 w-6 text-[#FF7F50]" />
              <span className="text-xl font-bold">Billettlyst</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Din destinasjon for billetter til konserter, sport, teater og mer.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Kategorier</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/music" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                  Musikk
                </Link>
              </li>
              <li>
                <Link to="/category/sports" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                  Sport
                </Link>
              </li>
              <li>
                <Link to="/category/arts" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                  Teater/Show
                </Link>
              </li>
              <li>
                <Link to="/category/family" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                  Familie
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Kundestøtte</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                  Kontakt Oss
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                  Refusjonspolicy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#FF7F50] transition-colors">
                  Personvern
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt Oss</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin size={18} className="text-[#FF7F50]" />
                <span className="text-gray-300">Storgata 1, 0155 Oslo</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-[#FF7F50]" />
                <span className="text-gray-300">+47 12 34 56 78</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-[#FF7F50]" />
                <span className="text-gray-300">kontakt@billettlyst.no</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Billettlyst. Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;