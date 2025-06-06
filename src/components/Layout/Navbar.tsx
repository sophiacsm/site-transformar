import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../lib/firebase';
import { LogOut, Menu, X, BarChart, Database } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
                <img
    src="https://associacaotransformar.org/wp-content/uploads/2020/07/logo-projeto-transformar-site.png"
    alt="Logo Transformar"
    className="h-8 w-8 text-primary-600" // Ou qualquer outra classe de Tailwind que você precise
  />
              <span className="ml-2 text-xl font-semibold">
  {Array.from("Portal de Transparência").map((char, i) => {
    const colors = ['#e44d52', '#f9c738', '#25a3c5'];
    const color = colors[i % colors.length];
    return (
      <span key={i} style={{ color }}>{char}</span>
    );
  })}
</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-[#25a3c5] hover:text-[#e44d52] hover:bg-gray-50 hover:underline hover:decoration-[#e44d52] hover:decoration-4 transition duration-300 ease-in-out"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/relatorios" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-[#25a3c5] hover:text-[#e44d52] hover:bg-gray-50 hover:underline hover:decoration-[#e44d52] hover:decoration-4 transition duration-300 ease-in-out"
                >
                  <span className="flex items-center">
                    <BarChart className="h-4 w-4 mr-1" />
                    Relatórios
                  </span>
                </Link>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm">Login</Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/relatorios" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center">
                    <BarChart className="h-4 w-4 mr-1" />
                    Relatórios
                  </span>
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <span className="flex items-center">
                    <LogOut className="h-4 w-4 mr-1" />
                    Sair
                  </span>
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};