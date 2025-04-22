import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Trade Fib Signals
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Dashboard
            </Link>
            <Link to="/signals" className="hover:text-blue-400 transition-colors">
              Signals
            </Link>
            <Link to="/seasonality" className="hover:text-blue-400 transition-colors">
              Seasonality
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="block py-2 px-4 hover:bg-gray-800 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/signals"
                className="block py-2 px-4 hover:bg-gray-800 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Signals
              </Link>
              <Link
                to="/seasonality"
                className="block py-2 px-4 hover:bg-gray-800 rounded transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Seasonality
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
